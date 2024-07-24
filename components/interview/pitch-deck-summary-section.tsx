import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import MarkdownBlock from "@/components/ui/markdown-block";
import FounderList, {Founder} from "@/components/panel/founder-list";
import ReportSection from "@/components/interview/report-section";

interface PitchDeckSummarySectionProps {
    pitchDeckSummary: string;
    traction: string;
    founders: Founder[];
    amountRaising: string;
}

export default function PitchDeckSummarySection({pitchDeckSummary, traction, founders, amountRaising}: PitchDeckSummarySectionProps) {
    const description = "We analyze the pitch deck and provide a birds eye view of the business. We help you make informed decision on the next steps"
    return (
        <ReportSection value="pitch-deck-summary" title="Pitch Deck Summary"
                                           description={description}
                                           content={
                                               <Accordion type="multiple" className={"w-full"}>
                                                   {/*    Create items for executive summary, current traction, founder(s), and investment ask */}
                                                   <AccordionItem value="executive-summary">
                                                       <AccordionTrigger iconColor="#FF7878">Executive
                                                           Summary</AccordionTrigger>
                                                       <AccordionContent>
                                                           <MarkdownBlock content={pitchDeckSummary}/>
                                                       </AccordionContent>
                                                   </AccordionItem>
                                                   <AccordionItem value="current-traction">
                                                       <AccordionTrigger iconColor="#FF7878">Current
                                                           Traction</AccordionTrigger>
                                                       <AccordionContent>
                                                           <MarkdownBlock content={traction}/>
                                                       </AccordionContent>
                                                   </AccordionItem>
                                                   <AccordionItem value="founders">
                                                       <AccordionTrigger
                                                           iconColor="#FF7878">Founder(s)</AccordionTrigger>
                                                       <AccordionContent>
                                                           <FounderList founders={founders}/>
                                                       </AccordionContent>
                                                   </AccordionItem>
                                                   <AccordionItem value="investment-ask">
                                                       <AccordionTrigger iconColor="#FF7878">Investment
                                                           Ask</AccordionTrigger>
                                                       <AccordionContent>
                                                           <MarkdownBlock content={amountRaising}/>
                                                       </AccordionContent>
                                                   </AccordionItem>
                                               </Accordion>
                                           }/>
    )
}