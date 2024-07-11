import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import FileUpload from "@/components/analyze/file-upload";
import {User, GlobalRole} from "@prisma/client/edge";
import Dashboard from "@/components/admin/dashboard";


export default async function AdminDashboardPage() {
    const session = await auth()

    if (!session?.user) {
        redirect(`/sign-in?next=/`)
    }
    console.log(session.user)

    if ((session.user as User).globalRole !== GlobalRole.SUPERADMIN) {
        redirect(`/`)
    }



    return <Dashboard />
}
