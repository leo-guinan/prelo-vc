'use client'
import {useSearchParams} from "next/navigation";
import ReportPanel from "@/components/panel/report";
import useSWR from "swr";
import {getPanelDetails} from "@/app/actions/interview";
import EmailComposer from "@/components/panel/email-composer";
import {PitchDeck, User} from "@prisma/client/edge";
import Spinner from "@/components/spinner";
import SampleReportPanel from "@/components/panel/sample-report";
import MarkdownBlock from "../ui/markdown-block";


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

export default function Panel({decks, user, view, content}: PanelProps) {

    const searchParams = useSearchParams()


    const {data} = useSWR(`${window.location.href}/api/panelData?${searchParams}`, getPanelDetails)


    return (
        <>

            <div className="h-full">
                {!data && !view && (
                    <Spinner size="xxxl"/>
                )}

                {!view &&data && decks?.length === 0 && (
                    <>
                        <SampleReportPanel/>
                    </>
                )}

                {!view && data && searchParams.get('view') === 'report' && <ReportPanel
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
                {!view && data && (searchParams.get('view')?.includes("_email")) && (
                    <>

                        <EmailComposer to={data.data.email} body={data.data.content} subject={data.data.subject}/>
                    </>
                )}
                {view === 'tool' && content && typeof content === 'string' && (
                    <>
                        <MarkdownBlock content={content}/>
                    </>
                )}
                {view === 'email' && content && typeof content === 'object' && (
                    <>
                        <EmailComposer to={content.to} body={content.body} subject={content.subject}/>
                    </>
                )}

            </div>

        </>
    )
}