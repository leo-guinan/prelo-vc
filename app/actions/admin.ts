'use server'

import { prisma } from "@/lib/utils";
import { configureSubmind } from "./interview";
import { auth } from "@/auth";
import { User } from "@prisma/client/edge";

export async function fixSubminds() {


    const session = await auth()
    if (!session?.user) {
        return {
            error: "User not found"
        }
    }

    if ((session.user as User).globalRole !== "SUPERADMIN") {
        return {
            error: "You are not authorized to fix subminds"
        }
    }

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