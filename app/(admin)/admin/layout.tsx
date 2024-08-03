import {auth} from "@/auth";
import AdminSidebar from "@/components/admin/sidebar";
import {GlobalRole, User} from "@prisma/client/edge";
import {redirect} from "next/navigation";
import {prisma} from "@/lib/utils";

interface ContextLayoutProps {
    children: React.ReactNode
}

export const fetchCache = 'force-no-store'

export default async function AnalysisLayout({children}: ContextLayoutProps) {
    const session = await auth()
    if (!session?.user) {
        redirect(`/sign-in?next=/admin`)
    }
    if ((session.user as User).globalRole !== GlobalRole.SUPERADMIN) {
        console.log("Redirecting user from sidebar, not superadmin", session.user.id)
        redirect(`/`)
    }

    const users = await prisma.user.findMany();

    return (
        <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
            <AdminSidebar users={users}/>
            <div
                className="group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
                {children}
            </div>
        </div>
    )
}
