import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import FileUpload from "@/components/analyze/file-upload";
import {User} from "@prisma/client/edge";


export default async function UploadPitchDeckPage() {
    const session = await auth()

    if (!session?.user) {
        redirect(`/sign-in?next=/`)
    }

    redirect(`/interview`)
    
}
