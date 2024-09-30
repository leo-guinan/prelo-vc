import {Sidebar} from '@/components/sidebar'

import {auth} from '@/auth'
import {DeckSidebar} from "@/components/deck-sidebar";
import { prisma } from '@/lib/utils';

export async function SidebarDesktop() {
    const session = await auth()

    if (!session?.user?.id) {
        return null
    }

    const userWithMemberships = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        include: {
            memberships: {
                include: {
                    organization: true
                }
            },
            shareProfile: true
        }
    })

    if (!userWithMemberships) {
        return null
    }
    


    return (
        <Sidebar
            className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
            <DeckSidebar userId={session.user.id} user={userWithMemberships}/>
        </Sidebar>
    )
}
