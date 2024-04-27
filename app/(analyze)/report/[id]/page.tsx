import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import PitchDeckAnalysis from "@/components/analyze/pitch-deck-analysis";
import {getPitchDeck, getScores} from "@/app/actions/analyze";
import {prisma} from "@/lib/utils";

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
        return {
            error: "Pitch deck not found"
        }
    }

    const scores = await getScores(pitchDeck.backendId)
    if ('error' in pitchDeckDocument) {
        console.log(pitchDeckDocument.error)
        return null
    }

    return <PitchDeckAnalysis pitchDeckAnalysis={pitchDeckDocument.content} uuid={pitchDeckDocument.uuid} scores={scores} complete={pitchDeckDocument.status ==="complete"}/>
}
