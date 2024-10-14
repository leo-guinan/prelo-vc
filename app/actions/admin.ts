'use server'

import { prisma } from "@/lib/utils";
import { configureSubmind } from "./interview";

export async function fixSubminds() {
    const users = await prisma.user.findMany({
        where: {
            submindId: null
        }
    })
    await Promise.all(users.map(async (user) => {
        console.log("User has submind pending, checking status")
        const submindResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/submind/status/`, {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
            },
            body: JSON.stringify({
                user_id: user.id
            })

        })
        const parsed = await submindResponse.json()
        console.log("Submind status", parsed)
        if (parsed.submind_id) {
            console.log("Submind id found, configuring submind")
            configureSubmind(parsed.submind_id, parsed.company, parsed.thesis, parsed.industries, parsed.check_size, parsed.passion, parsed.slug, parsed.name)
        }
    }))
}