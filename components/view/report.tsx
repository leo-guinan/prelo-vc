'use client'
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {ScrollArea} from "@/components/ui/scroll-area";
import ReportPanel from "@/components/panel/report";
import {useSearchParams} from "next/navigation";
import {Founder} from "@/components/panel/founder-list";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import MarkdownBlock from "@/components/ui/markdown-block";
import {User} from "@prisma/client/edge";
import Image from "next/image";

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
    user: User

}

const questions = [
    {
        question: "How do I get started?",
        answer: "Simply click the yellow upload deck button to upload a pitch deck once you activate your account. (see image) "
    },
    {
        question: "How does PreloVC create my investor twin?",
        answer: "PreloVC finds information about you, your industry and/or your investment firm to build your investor twin"
    },
    {
        question: "How does PreloVC calculate your VC Match ?",
        answer: "It matches your thesis, values and other investment requirements to the problem, solution, stage and the founder's domain expertise."
    },
    {
        question: "Can the matching in PreloVC be improved for me?",
        answer: "Yes of course, the more you interact with PreloVC the better it gets at learning exactly the type of deals you like\n"
    },
    {
        question: "What is a good score for a VC Match?",
        answer: "We've done a ton of tests here and we believe that a VC match of above 85% is a great score for deals you should be excited about."

    },
    {
        question: "Can PreloVC generate an investment memo based on the Pitch Deck?",
        answer: "Yes PreloVC dynamically generates an investment memo with each pitch deck you upload. Go straight to the executive summary section to see the investment memo."
    },
    {
        question: "Can I share a deal with an investor in my network?",
        answer: "Yes you can share an investment memo with investors you want to collaborate with. Simply head to the executive summary on the right and hit share."
    },
    {
        question: "What if I want to reject a deal, can it write an email to the founder?",
        answer: "Absolutely, PreloVC is designed to write empathetic but encouraging rejection emails on autopilot. The goal is to keep the founder in your funnel. Just ask it to \"Write a rejection email to [Startup]\""
    },
    {
        question: "Does PreloVC share any information about the founder?",
        answer: "Yes at a minimum, PreloVC will share twitter, LinkedIn and email addresses of the founders so that you can carry out early due diligence before a meeting."
    },
    {
        question: "How can I scale PreloVC to review hundreds of pitch decks?",
        answer: "Our white-label solution offers integrations into email inboxes CRMs. . . we also offer Venture Agents for research, founder screening, content creation and more."
    }
]


export default function ViewReport({
                                       companyName,
                                       summary,
                                       concerns,
                                       believe,
                                       amountRaising,
                                       recommendation,
                                       investmentScore,
                                       traction,
                                       nextStep,
                                       founders,
                                       scores,
                                       founderContactInfo,
                                       scoreExplanation,
                                       user
                                   }: ViewReportProps) {

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
                                    <div className="flex flex-col p-y-12 w-3/5 mx-auto h-full">
                                        <div className="w-full flex flex-row justify-start items-center mb-4">
                                            <div className="flex w-1/8">
                                                <Image src="/logo.png" width={32} height={32} alt="PreloVC Logo"
                                                       className="rounded-full"/>
                                            </div>
                                            <div className="flex ml-4">
                                                Some <span
                                                className="text-objections">frequently asked questions </span>to learn
                                                more 💡
                                            </div>

                                        </div>

                                        <Accordion type="multiple" className="w-full">
                                            {questions.map((q, index) => (
                                                <AccordionItem value={`question-${index}`} key={`question-${index}`}>
                                                    <AccordionTrigger
                                                        iconColor="#8BDDE4" className="whitespace-nowrap">{q.question}</AccordionTrigger>
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
                                        user={user}
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