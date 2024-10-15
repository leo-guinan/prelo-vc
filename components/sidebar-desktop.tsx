import { Sidebar } from '@/components/sidebar'
import { DeckSidebar } from "@/components/deck-sidebar";
import { prisma } from '@/lib/utils';
import { SubscribeButton } from '@/components/subscribe-button';



export async function SidebarDesktop({ userId }: { userId: string }) {

    if (!userId) {
        return null
    }

    const userWithMemberships = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            memberships: {
                include: {
                    organization: true
                }
            },
            shareProfile: true,
            subscriptions: true
        }
    })

    if (!userWithMemberships) {
        return null
    }

    const hasActiveSubscription = userWithMemberships.subscriptions.some(
        sub => sub.stripeStatus === 'active'
    )

    return (
        <Sidebar
            className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
            <DeckSidebar userId={userId} user={userWithMemberships} />
            {!hasActiveSubscription && (
                <div className="mt-auto p-4">
                    <SubscribeButton userId={userId} disabled={true}/>
                </div>
            )}
        </Sidebar>
    )
}
