'use client'
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {ScrollArea} from "@/components/ui/scroll-area";
import ReportPanel from "@/components/panel/report";
import {useSearchParams} from "next/navigation";
import {Founder} from "@/components/panel/founder-list";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import MarkdownBlock from "@/components/ui/markdown-block";

interface ViewReportProps {
    companyName: string
    summary: string
    concerns: {
        title: string;
        concern: string;
    }[];
    believe: string
    amountRaising: string
    recommendation: string
    investmentScore: number
    traction: string
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
    },
    scoreExplanation: Record<string, string>

}

const questions = [
        {
            question: "How do I get started?",
            answer: "Click \"Analyze New Deck\" on the left panel and upload a deck. Then head over to \"View Pitch Deck\" check out your investment recommendation. "
        },
        {
            question: "How do I bulk load pitch decks?",
            answer: "You are currently on the \"Angel Plan\", you'll have to upgrade to the \"Venture Plan\" and you'll be able to load and analyze 100s of decks on autopilot. Send an email to sales@prelovc.com to inquire about the \"Venture Plan\""
        },
        {
            question: "How do I move pitch decks into my funnel?",
            answer: "On the right panel, Click \"Book Call\" , \"Maybe\" or \"Pass\" on each pitch deck report and see the decks appear in the relevant folder. "
        },
        {
            question: "Can I connect with the founder?",
            answer: "Each pitch deck has the name and contact details of every founder - simply ask the AI to \"write a follow up email to the [founder]\""
        },
        {
            question: "How do I search for decks I'm interested in?",
            answer: "Just use the search bar on the left panel and write in simple language like \"find all the decks that scored 80% this week\""

        },
    ]


export default function ViewReport({companyName, summary, concerns, believe, amountRaising, recommendation, investmentScore, traction, nextStep, founders, scores, founderContactInfo, scoreExplanation}: ViewReportProps) {

    const searchParams = useSearchParams()

    return (
        <>
            <div className={'pt-4 md:pt-10 size-full mx-auto box-border'}

            >
                <>
                    <div className="flex flex-col-reverse sm:flex-row h-full">
                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel>
                                <div
                                    className="flex flex-col w-full h-full">
                                    <div className="flex flex-col p-y-12 w-4/5 mx-auto h-full">
                                        <Accordion type="multiple" className="w-full">
                {questions.map((q, index) => (
                    <AccordionItem value={`question-${index}`} key={`question-${index}`}>
                        <AccordionTrigger iconColor="#8BDDE4">{q.question}</AccordionTrigger>
                        <AccordionContent>
                            <MarkdownBlock content={q.answer}/>
                        </AccordionContent>
                    </AccordionItem>
                ))}


            </Accordion>

                                    </div>
                                </div>

                            </ResizablePanel>
                            <ResizableHandle/>
                            <ResizablePanel>
                                <ScrollArea className="flex flex-col size-full pb-8">
                                    <ReportPanel
                                        companyName={companyName}
                                        pitchDeckSummary={summary}
                                        concerns={concerns}
                                        believe={believe}
                                        amountRaising={amountRaising}
                                        recommendation={recommendation}
                                        investmentScore={investmentScore}
                                        traction={traction}
                                        nextStep={nextStep}
                                        founders={founders}
                                        scores={scores}
                                        founderContactInfo={founderContactInfo}
                                        scoreExplanation={scoreExplanation}
                                        deck_uuid={searchParams.get('deck_uuid') as string}
                                        report_uuid={searchParams.get('report_uuid') as string}
                                    />
                                </ScrollArea>
                            </ResizablePanel>
                        </ResizablePanelGroup>


                    </div>

                </>

            </div>
        </>
    )
}