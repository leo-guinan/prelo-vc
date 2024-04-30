import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import PitchDeckAnalysis from "@/components/analyze/pitch-deck-analysis";
import {getAnalysisChat, getPitchDeck, getScores} from "@/app/actions/analyze";
import {prisma} from "@/lib/utils";
import AnalysisChat from "@/components/analyze/chat";

interface PitchDeckPageProps {
    params: {
        id: string
    }
}

export default async function PreloUploadPitchDeckPage({params}: PitchDeckPageProps) {
    const session = await auth()

    if (!session?.user) {
        redirect(`/sign-in?next=/`)
    }

    const pitchDeckDocument = await getPitchDeck(Number(params.id));
    const pitchDeck = await prisma.pitchDeckRequest.findUnique({
        where: {
            id: Number(params.id)
        }
    })

    if (!pitchDeck) {
       return null
    }

    const scores = await getScores(pitchDeck.backendId)
    if ('error' in pitchDeckDocument) {
        console.log(pitchDeckDocument.error)
        return null
    }

    const response = await getAnalysisChat(Number(params.id))
    if ('error' in response) {
        console.log(response.error)
        return null
    }

    return <AnalysisChat pitchDeckAnalysis={pitchDeckDocument.content} uuid={pitchDeckDocument.uuid} scores={scores}
                         complete={pitchDeckDocument.status === "complete"} messages={response.messages}/>
}
