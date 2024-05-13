import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import PitchDeckAnalysis from "@/components/analyze/pitch-deck-analysis";
import {getAnalysisChat, getDeckReport, getPitchDeck, getScores, triggerCheck} from "@/app/actions/analyze";
import {formatToday, prisma} from "@/lib/utils";
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

    const pitchDeck = await prisma.pitchDeckRequest.findUnique({
        where: {
            id: Number(params.id)
        }
    })

    if (!pitchDeck) {
       return null
    }
    await triggerCheck();

    const scores = await getScores(pitchDeck.id)
    const pitchDeckReport = await getDeckReport(pitchDeck.id)

    const response = await getAnalysisChat(Number(params.id))
    if ('error' in response) {
        console.log(response.error)
        return null
    }

    await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            currentDeckId: Number(params.id)
        }
    })

    return <AnalysisChat
        user={session.user}
        uuid={pitchDeck.uuid}
        scores={scores}
        messages={response.messages}
        title={pitchDeck.name ??
            formatToday(pitchDeck.createdAt)}
        concern={pitchDeckReport.top_concern}
        objections={pitchDeckReport.objections}
        howToAddress={pitchDeckReport.how_to_overcome}
    />
}
