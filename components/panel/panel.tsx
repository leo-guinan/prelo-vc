'use client'
import { useSearchParams } from "next/navigation";
import ReportPanel from "@/components/panel/report";
import useSWR from "swr";
import { getPanelDetails } from "@/app/actions/interview";
import EmailComposer from "@/components/panel/email-composer";
import { PitchDeck, User } from "@prisma/client/edge";
import Spinner from "@/components/spinner";
import SampleReportPanel from "@/components/panel/sample-report";
import MarkdownBlock from "../ui/markdown-block";
import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Link from "next/link";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";


export interface EmailContent {
    to: string
    body: string
    subject: string
}

interface PanelProps {
    decks?: PitchDeck[]
    user: User
    view: null | string
    content: null | string | EmailContent
}
export interface NavigateToReport {
    report_uuid: string;
    deck_uuid: string;
}
export default function Panel({ decks, user, view, content }: PanelProps) {


    const searchParams = useSearchParams()
    const [displayedView, setDisplayedView] = useState<string | null>(null)
    const [displayedContent, setDisplayedContent] = useState<string | EmailContent | null>(null)
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

    const [navigateToReport, setNavigateToReport] = useState<NavigateToReport>({
        report_uuid: searchParams.get('report_uuid') ?? user.currentReportUUID ?? '',
        deck_uuid: searchParams.get('deck_uuid') ?? user.currentDeckUUID ?? ''
    });
    useEffect(() => {
        setDisplayedView(view)
        setDisplayedContent(content)
    }, [view, content])

    useEffect(() => {
        setNavigateToReport({
            report_uuid: searchParams.get('report_uuid') ?? user.currentReportUUID ?? '',
            deck_uuid: searchParams.get('deck_uuid') ?? user.currentDeckUUID ?? ''
        })
    }, [searchParams, user])

    useEffect(() => {
        console.log("panel: searchParams", searchParams)
    }, [searchParams])

    useEffect(() => {
        console.log("panel: view", view)
    }, [view])

    useEffect(() => {
        console.log("panel: content", content)
    }, [content])

    const { data } = useSWR(`${window.location.href}/api/panelData?${searchParams}`, getPanelDetails)


    return (
        <>

            <div className="h-full">
                {!data && !displayedView && (
                    <Spinner size="xxxl" />
                )}

                {!displayedView && data && decks?.length === 0 && (
                    <>
                        <SampleReportPanel />
                    </>
                )}

                {!displayedView && data && searchParams.get('view') === 'report' && <ReportPanel
                    companyName={data.data.companyName}
                    pitchDeckSummary={data.data.executiveSummary}
                    concerns={data.data.concerns}
                    believe={data.data.believe}
                    amountRaising={data.data.amountRaising}
                    recommendation={data.data.recommendation}
                    investmentScore={data.data.investmentScore}
                    traction={data.data.traction}
                    nextStep={data.data.nextStep}
                    founders={data.data.founders}
                    scores={data.data.scores}
                    founderContactInfo={data.data.founderContactInfo}
                    scoreExplanation={data.data.scoreExplanation}
                    deck_uuid={searchParams.get('deck_uuid') as string}
                    report_uuid={searchParams.get('report_uuid') as string}
                    user={user}
                />}
                {!displayedView && data && (searchParams.get('view')?.includes("_email")) && (
                    <>

                        <EmailComposer to={data.data.email} body={data.data.content} subject={data.data.subject} user={user} />
                    </>
                )}
                {displayedView === 'tool' && displayedContent && typeof displayedContent === 'string' && (
                    <>
                        <Link
                            href={`?report_uuid=${navigateToReport.report_uuid}&deck_uuid=${navigateToReport.deck_uuid}&view=report`}
                            onClick={() => {
                                setDisplayedView(null)
                                setDisplayedContent(null)
                            }}
                            className="flex flex-row text-objections text-xl align-text-top mb-8">

                            <span className=""> {'<'} Back</span>
                        </Link>
                        <ScrollArea className="flex flex-row justify-between w-4/5 mx-auto pb-8">
                            <ScrollBar orientation="horizontal" />
                            <ScrollBar orientation="vertical" />
                            <MarkdownBlock content={displayedContent} />
                            <div className="flex flex-row justify-center mt-8">
                            <button
                                type="button"
                                className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => copyToClipboard(displayedContent)}
                            >
                                {!isCopied && (
                                    <span>Copy To Clipboard</span>
                                )}
                                {isCopied && (
                                    <span>Copied!</span>
                                )}
                            </button>
                            </div>
                        </ScrollArea>
                    </>
                )}
                {displayedView === 'email' && displayedContent && typeof displayedContent === 'object' && (
                    <>
                        <EmailComposer to={displayedContent.to} body={displayedContent.body} subject={displayedContent.subject} user={user} />
                    </>
                )}

            </div>

        </>
    )
}