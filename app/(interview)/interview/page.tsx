import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import FileUpload from "@/components/analyze/file-upload";
import {User} from "@prisma/client/edge";
import InterviewChat from "@/components/interview/chat";
import {getAnalysisChat} from "@/app/actions/analyze";
import {getInterviewChat} from "@/app/actions/interview";
import {nanoid, prisma} from "@/lib/utils";


export default async function InterviewPage() {
    const session = await auth()

    if (!session?.user) {
        redirect(`/sign-in?next=/`)
    }

    const user = session.user as User
    let interviewUUID = user.interviewUUID
    if (!interviewUUID) {
        interviewUUID = nanoid()
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                interviewUUID
            }
        })

    }

    const response = await getInterviewChat()

    if ('error' in response) {
        console.log(response.error)
        return null
    }

    const userWithMemberships = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            memberships: true
        }
    })

    if (!userWithMemberships) {
        return null
    }




    return <InterviewChat messages={response.messages} uuid={(session.user as User).interviewUUID ?? ""} user={userWithMemberships} />
}
