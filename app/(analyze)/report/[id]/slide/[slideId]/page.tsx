import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import PitchDeckAnalysis from "@/components/analyze/pitch-deck-analysis";
import {getPitchDeck, getScores} from "@/app/actions/analyze";
import {prisma} from "@/lib/utils";
import {getPitchDeckSlide, getPitchDeckSlideAnalysis} from "@/app/actions/slide";
import PitchDeckViewer from "@/components/slides/viewer";

interface PitchDeckSlidePageProps {
    params: {
        slideId: string
    }
}

export default async function PreloUploadPitchDeckPage({params}: PitchDeckSlidePageProps) {
    const session = await auth()

    if (!session?.user) {
        redirect(`/sign-in?next=/`)
    }

    const pitchDeckSlide = await getPitchDeckSlide(Number(params.slideId));
    const slideAnalysis = await getPitchDeckSlideAnalysis(Number(params.slideId))

    if (!pitchDeckSlide) {
        return {
            error: "Pitch deck slide not found"
        }
    }


    return <PitchDeckViewer />
}
