import CollapsibleSection from "@/components/collapsible-section";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
//@ts-ignore
import remarkCollapse from "remark-collapse";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import {CodeBlock} from "@/components/ui/codeblock";
import {MemoizedReactMarkdown} from "@/components/markdown";
import {cn} from "@/lib/utils";
import Image from "next/image";
import PitchDeckSummary from "@/components/analyze/pitch-deck-summary";
import Traction from "@/components/analyze/traction";
import Concerns from "@/components/analyze/concerns";
import Believe from "@/components/analyze/believe";
import Recommendation from "@/components/analyze/recommendation";
import {RecommendationOption} from "@/components/analyze/chat";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import PitchDeckAnalysis from "@/components/analyze/pitch-deck-analysis";
import MarkdownBlock from "@/components/ui/markdown-block";

interface ReportProps {
    pitchDeckSummary: string;
    traction: string;
    concerns: string;
    believe: string;
    recommendation: string
    recommendationOption: RecommendationOption
}

export default function Report({pitchDeckSummary, traction, believe, concerns, recommendation, recommendationOption}: ReportProps) {
    return (
        <div className="relative px-8 mt-8" >
            <div
                className={cn('group relative mb-4 flex flex-col flex-1 items-start w-full')}
            >
                <div className="flex flex-row w-full max-w-xl">
                    <span>Decision: </span>
                    <button className="bg-howTo p-2 rounded-md">
                        Book Call
                    </button>
                    <button className="bg-objections p-2 rounded-md">
                        Maybe
                    </button>
                    <button className="bg-concern p-2 rounded-md">
                        Pass
                    </button>
                </div>

                <div className="flex flex-col w-full max-w-xl">
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value={`pitch-deck-analysis`} key={`pitch-deck-analysis`}>
                            <AccordionTrigger iconColor="#FFCC2F">Recommendation</AccordionTrigger>
                            <AccordionContent>
                                <MarkdownBlock content={recommendation} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value={`top-concerns`} key={`top-concerns`}>
                            <AccordionTrigger iconColor="#FF7878">Pitch Deck Summary</AccordionTrigger>
                            <AccordionContent>
                                <MarkdownBlock content={pitchDeckSummary}/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value={`objections`} key={`objections`}>
                            <AccordionTrigger iconColor="#FFCC2F">Team | TAM | Traction</AccordionTrigger>
                            <AccordionContent>
                                <MarkdownBlock content={traction}/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value={`how-to-address`} key={`how-to-address`}>
                            <AccordionTrigger iconColor="#8BDDE4">5 Major Concerns</AccordionTrigger>
                            <AccordionContent>
                                <MarkdownBlock content={concerns}/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value={`how-to-address`} key={`how-to-address`}>
                            <AccordionTrigger iconColor="#8BDDE4">5 Reasons to Believe</AccordionTrigger>
                            <AccordionContent>
                                <MarkdownBlock content={believe}/>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    )
}