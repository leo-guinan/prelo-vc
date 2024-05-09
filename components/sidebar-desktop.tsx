import {Sidebar} from '@/components/sidebar'

import {auth} from '@/auth'
import {AnalysisSidebar} from './analysis-sidebar'
import {prisma} from "@/lib/utils";

export async function SidebarDesktop() {
    const session = await auth()

    if (!session?.user?.id) {
        return null
    }

    const decks = await prisma.pitchDeckRequest.findMany({
        where: {
            ownerId: session.user.id,
        },
    })

    return (
        <Sidebar
            className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
            <AnalysisSidebar userId={session.user.id} decks={decks}/>
        </Sidebar>
    )
}
