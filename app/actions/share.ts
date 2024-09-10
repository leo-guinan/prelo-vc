'use server'

import { prisma } from "@/lib/utils"
import { headers } from "next/headers"

export async function getSharedReport(deck_uuid:string, report_uuid: string) {
    const getInvestorReportResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/shared/report/`, {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: JSON.stringify({
            report_uuid,
            deck_uuid
        })

    })

    const parsed = await getInvestorReportResponse.json()

    return {
        executive_summary: parsed.executive_summary,
        company_name: parsed.company_name,
    }
}

export async function getUserBySlug(slug: string) {

    const user = await prisma.user.findUnique({
        where: {
            slug
        },
        include: {
            memberships: true
        }
    })

    if (!user) {
        return null
    }

    return user
}

export async function uploadDeckFromSharedLink(slug:string, formData: FormData) {
    const headersList = headers()
    const xForwardedFor = headersList.get('x-forwarded-for')
    const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : ""
  
    const user = await getUserBySlug(slug)

    if (!user?.submindId) {
        return {
            error: "Configure submind before running this step."
        }
    }



    // Add the submind_id to the FormData
    formData.append('client', 'prelovc');
    formData.append('investor_id', user.id);
    formData.append('firm_id', '1');
    formData.append('user_ip', ip);
    formData.append('source', slug)


    const sendMessageResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/upload/`, {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: formData
    })

    const parsed = await sendMessageResponse.json()


    await prisma.pitchDeck.create({
        data: {
            uuid: parsed.deck_uuid,
            owner: {
                connect: {
                    id: user.memberships[0].organizationId
                }
            },
            name: parsed.file_name || `Pitch Deck ${new Date().toISOString()}`
        }
    })

    return {
        message: parsed.message,
    }
}