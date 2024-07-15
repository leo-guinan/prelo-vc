import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import {GlobalRole, User} from "@prisma/client/edge";
import InterviewChat from "@/components/interview/chat";
import {getInterviewChat} from "@/app/actions/interview";
import {prisma} from "@/lib/utils";


interface AdminInterviewPageProps {
    params: {
        userId: string
    }
}

export default async function AdminInterviewPage({params}: AdminInterviewPageProps) {
    const session = await auth()

    if (!session?.user) {
        redirect(`/sign-in?next=/`)
    }

    if ((session.user as User).globalRole !== GlobalRole.SUPERADMIN) {
        redirect(`/`)
    }


    const response = await getInterviewChat(params.userId)
    const user = await prisma.user.findUnique({
        where: {
            id: params.userId
        }
    })

    if (!user) {
        return null
    }
    if ('error' in response) {
        console.log(response.error)
        return null
    }


    return <InterviewChat messages={response.messages} uuid={user.interviewUUID ?? ""} user={user}/>
}
