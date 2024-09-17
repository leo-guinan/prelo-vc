'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/utils"

export async function setCurrentContext(deckUUID: string, reportUUID: string) {
    const session = await auth()
    const user = session?.user
    if (!user) {
        return
    }
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            currentDeckUUID: deckUUID,
            currentReportUUID: reportUUID
        }
    })
}