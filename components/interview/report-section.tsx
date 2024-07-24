import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/tooltip";

interface ReportSectionProps {
    value: string;
    title: string;
    description: string | React.ReactNode;
    content: React.ReactNode;
}

export default function ReportSection({value, title, description, content}: ReportSectionProps) {
    return (<AccordionItem value={value}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AccordionTrigger iconColor="#8BDDE4">
                            <div>
                                <h3 className="text-lg font-semibold">{title}</h3>
                            </div>
                        </AccordionTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                        <p className="break-words">{description}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <AccordionContent>
                {content}
            </AccordionContent>
        </AccordionItem>
    );
}