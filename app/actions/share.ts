'use server'

import { nanoid, prisma } from "@/lib/utils"
import { MongoDBChatMessageHistory } from "@langchain/mongodb"
import { User } from "@prisma/client/edge"
import { BufferMemory } from "langchain/memory"
import { MongoClient } from "mongodb"
import { headers } from "next/headers"

export async function getSharedReport(deck_uuid: string, report_uuid: string) {
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
            shareProfile: true,
            memberships: {
                include: {
                    organization: true,
                }
            },
        }
    })

    if (!user) {
        return null
    }

    return user
}

export async function uploadDeckFromSharedLink(slug: string, formData: FormData) {
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
        uuid: parsed.deck_uuid
    }
}

export async function sendSimpleMessage(slug: string, message: string, deck_uuid: string) {
    const user = await getUserBySlug(slug)

    if (!user?.submindId) {
        return {
            error: "Configure submind before running this step."
        }
    }

    const sendMessageResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/chat/`, {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: JSON.stringify({
            message,
            investor_id: user.id,
            deck_uuid: deck_uuid,
            submind_id: user.submindId,
            source: slug
        })
    })

    const parsed = await sendMessageResponse.json()

    return {
        message: parsed.message,
    }

}

export async function getMessages(user: User, uuid: string) {
    const client = new MongoClient(process.env.MONGO_URL || "");
    await client.connect();
    const collection = client.db("prelovc").collection("prelovc_memory");
    const lookupUUID = `${user.slug}_${uuid}`
    const history = new MongoDBChatMessageHistory({
        collection,
        sessionId: `${lookupUUID}_chat`,
    })



    const messages = await history.getMessages();
    const interpretedMessages = messages.map((message) => {


        return {
            id: nanoid(),
            content: message.content.toString(),
            role: message._getType() === "human" ? "user" : "assistant",
            type: "text"

        }
    }
    )


    return interpretedMessages



    // // get them from the api
    // const messages = await fetch(`${process.env.PRELO_API_URL as string}deck/chat/messages/`, {
    //     method: "POST",
    //     headers: {
    //         Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
    //     },
    //     body: JSON.stringify({
    //         source: user.slug,
    //         deck_uuid: uuid
    //     })
    // })


    // const parsed = await messages.json()
    // console.log("Messages: ", parsed.messages)
    // return parsed.messages
}