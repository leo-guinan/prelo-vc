import {ScrollArea} from "@/components/ui/scroll-area";
import Panel from "@/components/panel/panel";
import MarkdownBlock from "@/components/ui/markdown-block";

interface SharedReportProps {
    report: string
    company_name: string

}

export default function SharedReport({report, company_name}: SharedReportProps) {
    return (
        <div className="container w-full max-w-3xl mx-auto">
            <div className={'pt-4 md:pt-10 size-full mx-auto box-border'} >

                <>
                    <div className="flex flex-col-reverse sm:flex-row h-full">
                        <h1 className="text-3xl font-bold text-center mb-8">{company_name}</h1>
                        <ScrollArea className="flex flex-col size-full pb-8">
                            <MarkdownBlock content={report}/>
                        </ScrollArea>


                    </div>

                </>

            </div>
        </div>
    )
}