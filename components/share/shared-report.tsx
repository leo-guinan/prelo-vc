import {ScrollArea} from "@/components/ui/scroll-area";
import MarkdownBlock from "@/components/ui/markdown-block";
import {Banner} from "@/components/share/banner";
import { auth } from "@/auth";

interface SharedReportProps {
    report: string
    company_name: string
    reportUUID: string
    deckUUID: string

}

export default async function SharedReport({report, company_name, deckUUID, reportUUID}: SharedReportProps) {
    const session = await auth()
    return (
        <div className="relative">
            {!session?.user && <Banner deckUUID={deckUUID} reportUUID={reportUUID}/>}

            <div className="container w-full max-w-3xl mx-auto mt-24">
                <div className={'pt-4 md:pt-10 size-full mx-auto box-border'}>

                    <div className="flex flex-col-reverse sm:flex-row h-full">
                        <h1 className="text-3xl font-bold text-center mb-8">{company_name}</h1>
                        <ScrollArea className="flex flex-col size-full pb-8">
                            <MarkdownBlock content={report}/>
                        </ScrollArea>


                    </div>


                </div>
            </div>
        </div>
    )
}