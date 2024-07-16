import {cn} from "@/lib/utils";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import MarkdownBlock from "@/components/ui/markdown-block";
import FounderList, {Founder} from "@/components/panel/founder-list";
import Scores from "@/components/analyze/scores";
import {IconDollarSign, IconEmail} from "@/components/ui/icons";
import {SyntheticEvent} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useSearchParams} from "next/navigation";


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

        const searchParams = useSearchParams()


    const handleNextStep = (e: SyntheticEvent) => {
        e.preventDefault();
        console.log("Next Step Clicked")
        if (nextStep.next_step_id === '1') {
            // open mailto link in new window
            window.open(`mailto:${founderContactInfo.email}`)
        } else if (nextStep.next_step_id === '2') {
            console.log("Learn more about the company")
        } else if (nextStep.next_step_id === '3') {

        }
    }
    return (
        <>
            <div className="h-full">
                <h1 className="flex justify-center w-full mx-auto mt-2 mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl">{companyName}</h1>
                <div className="relative px-8 mt-8">
                    <div className="flex flex-row items-center justify-center mt-12 mb-8">
                        <Scores scores={scores}/>
                    </div>
                    <div className="flex flex-col items-start justify-center w-1/3 mx-auto">
                        <p className="text-xl tracking-tight text-gray-900 dark:text-zinc-50 sm:text-2xl mb-8 flex flex-row ">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-objections text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring size-8 "
                            >
                                <IconDollarSign className="bg-objections rounded-full"/>

                                <span className="sr-only">Dollar</span>
                            </Button>
                            <span className="ml-4 w-4/5 text-base items-center flex">Ask: {amountRaising}</span>
                        </p>
                        <p className="text-xl tracking-tight text-gray-900 dark:text-zinc-50 sm:text-2xl mb-8 flex flex-row">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-objections text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring size-8 "
                            >
                                <IconEmail className="bg-objections rounded-full"/>
                            </Button>
                            {nextStep.next_step_id === "3" && (
                                <Link
                                    className="ml-4 w-4/5 text-base underline text-objections items-center flex"
                                    href={`?report_uuid=${searchParams.get('report_uuid')}&deck_uuid=${searchParams.get('deck_uuid')}&view=rejection_email`}>
                                    {nextStep.next_step_description}
                                </Link>
                            )}
                            {nextStep.next_step_id !== "3" && (
                                <a href="" onClick={handleNextStep}
                                   className="ml-4 w-4/5 text-base underline text-objections items-center flex">{nextStep.next_step_description}</a>
                            )}

                        </p>
                    </div>
                    <div
                        className={cn('group relative mb-4 flex flex-col flex-1 items-start w-full')}
                    >


                        <div className="flex flex-col w-full max-w-xl">
                            <Accordion type="multiple" className="w-full">
                                <AccordionItem value={`top-concerns`} key={`top-concerns`}>
                                    <AccordionTrigger iconColor="#FF7878">Pitch Deck Summary</AccordionTrigger>
                                    <AccordionContent>
                                        <MarkdownBlock content={pitchDeckSummary}/>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value={`concerns`} key={`concerns`}>
                                    <AccordionTrigger iconColor="#8BDDE4">Top Concerns</AccordionTrigger>
                                    <AccordionContent>
                                        <Accordion type="multiple" className="w-full">
                                            {concerns?.map((concern, index) => (
                                                <AccordionItem value={concern.title} key={concern.title}>
                                                    <AccordionTrigger
                                                        iconColor="#FF7878">{concern.title}</AccordionTrigger>
                                                    <AccordionContent>
                                                        <MarkdownBlock content={concern.concern}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value={`founder`} key={`founder`}>
                                    <AccordionTrigger iconColor="#8BDDE4">Founders</AccordionTrigger>
                                    <AccordionContent>
                                        <FounderList founders={founders}/>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}