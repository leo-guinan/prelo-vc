import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import MarkdownBlock from "@/components/ui/markdown-block";
import ReportSection from "@/components/interview/report-section";

interface InvestorConcernsSectionProps {
    concerns: {
        title: string;
        concern: string;
    }[]
}

export default function InvestorConcernsSection({concerns}: InvestorConcernsSectionProps) {
    const description = "This section dives into your mind as an investor, we our learnings about you to review the key risks and concerns based on the insights gathered from the deck"
    return (
        <ReportSection value="concerns" title={"Investor Concerns"}
                       description={description}
                       content={
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
                       }/>
    )
}