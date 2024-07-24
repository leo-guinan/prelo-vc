import {Accordion} from "@/components/ui/accordion";
import {Founder} from "@/components/panel/founder-list";
import Scores from "@/components/analyze/scores";
import NextStepsSection from "@/components/interview/next-steps-section";
import ScoreAnalysisSection from "@/components/interview/score-analysis-section";
import InvestorConcernsSection from "@/components/interview/investor-concerns-section";
import PitchDeckSummarySection from "@/components/interview/pitch-deck-summary-section";


interface ReportPanelProps {
    pitchDeckSummary: string;
    traction: string;
    concerns: {
        title: string;
        concern: string;
    }[];
    believe: string;
    recommendation: string
    companyName: string;
    amountRaising: string;
    investmentScore: number;
    nextStep: {
        next_step_id: string;
        next_step_description: string;
    },
    founders: Founder[],
    scores: {
        market: {
            score: number
            reason: string
        },
        team: {
            score: number
            reason: string
        },
        product: {
            score: number
            reason: string
        },
        traction: {
            score: number
            reason: string

        },
        final: {
            score: number
            reason: string
        }
    }
    founderContactInfo: {
        email: string
    }

}

export default function ReportPanel({
                                        pitchDeckSummary,
                                        traction,
                                        concerns,
                                        believe,
                                        recommendation,
                                        companyName,
                                        amountRaising,
                                        investmentScore,
                                        nextStep,
                                        founders,
                                        scores,
                                        founderContactInfo

                                    }: ReportPanelProps) {


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">{companyName}</h1>

            <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="container max-w-xl w-full justify-center">
                        <Scores scores={scores}/>

                        <Accordion type="multiple" className="mt-8 max-w-xl">

                            <PitchDeckSummarySection pitchDeckSummary={pitchDeckSummary} traction={traction}
                                                     founders={founders} amountRaising={amountRaising}/>

                            <InvestorConcernsSection concerns={concerns}/>

                            <ScoreAnalysisSection/>


                            <NextStepsSection/>

                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    )
}