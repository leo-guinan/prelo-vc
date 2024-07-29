import {ScrollArea} from "@/components/ui/scroll-area";
import MarkdownBlock from "@/components/ui/markdown-block";
import {Banner} from "@/components/share/banner";
import {auth} from "@/auth";
import Link from "next/link";
import {Button} from "../ui/button";
import {IconShare} from "@/components/ui/icons";

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
            {!session?.user && <Banner/>}

            <div className="container w-full max-w-3xl mx-auto mt-24">
                <div className={'pt-4 md:pt-10 size-full mx-auto box-border'}>

                    <div className="flex flex-col-reverse sm:flex-row h-full">
                        <h1 className="text-3xl font-bold text-center mb-8">{company_name}</h1>
                        <ScrollArea className="flex flex-col size-full pb-8">
                            <MarkdownBlock content={report}/>
                        </ScrollArea>

                    </div>
                    <div className="flex flex-row space-x-4">
                        {!session?.user && (
                            <Link href={`/login?redirect=/view/${deckUUID}/${reportUUID}`}
                            >
                                <Button
                                    className="rounded bg-objections px-6 py-3 h-10 text-sm font-semibold text-standard shadow-sm hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
                                    Create Account
                                </Button>
                            </Link>
                        )}
                        <Button type="button" variant="default"
                                className="rounded bg-indigo-600 px-6 py-3 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
                            <IconShare className="mr-2"/>
                            <span>Share</span>
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}