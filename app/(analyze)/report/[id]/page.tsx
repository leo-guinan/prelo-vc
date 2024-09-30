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

    // const scores = await getScores(pitchDeck.id)
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
    const userWithMemberships = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        include: {
            memberships: {
                include: {
                    organization: true
                }
            },
            shareProfile: true,
        }
    })  
    if (!userWithMemberships) {
        return null
    }
    // "concerns": analysis.concerns,
    //             "believe": analysis.believe,
    //             "traction": analysis.traction,
    //             "summary": analysis.summary,
    //             "recommendation": recommendation,
    //             "recommendation_reasons": analysis.investor_report.recommendation_reasons,

    return <AnalysisChat
        user={userWithMemberships}
        uuid={pitchDeck.uuid}
        scores={{
            market: {
                score: 0,
                reason: ""
            },
            product: {
                score: 0,
                reason: ""
            },
            team: {
                score: 0,
                reason: ""
            },
            traction: {
                score: 0,
                reason: ""
            },
            founder: {
                score: 0,
                reason: ""
            },
            final: {
                score: 0,
                reason: ""
            }

        }}
        messages={response.messages}
        title={pitchDeck.name ??
            formatToday(pitchDeck.createdAt)}
        concerns={pitchDeckReport.concerns}
        believe={pitchDeckReport.believe}
        traction={pitchDeckReport.traction}
        summary={pitchDeckReport.summary}
        recommendation={pitchDeckReport.recommendation_reasons}
        recommendationOption={{
            value: pitchDeckReport.recommendation
        }}



    />
}
