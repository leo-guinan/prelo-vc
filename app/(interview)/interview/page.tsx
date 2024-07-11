import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import FileUpload from "@/components/analyze/file-upload";
import {User} from "@prisma/client/edge";
import InterviewChat from "@/components/interview/chat";
import {getAnalysisChat} from "@/app/actions/analyze";
import {getInterviewChat} from "@/app/actions/interview";


export default async function InterviewPage() {
    const session = await auth()

    if (!session?.user) {
        redirect(`/sign-in?next=/`)
    }

    const response = await getInterviewChat()

    if ('error' in response) {
        console.log(response.error)
        return null
    }



    return <InterviewChat messages={response.messages} uuid={(session.user as User).interviewUUID ?? ""} user={session.user as User} />
}
