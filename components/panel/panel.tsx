'use client'
import {useSearchParams} from "next/navigation";
import ReportPanel from "@/components/panel/report";
import useSWR from "swr";
import {getPanelDetails} from "@/app/actions/interview";
import EmailComposer from "@/components/panel/email-composer";

export default function Panel() {

    const searchParams = useSearchParams()


    const {data} = useSWR(`${window.location.href}/api/panelData?${searchParams}`, getPanelDetails)


    return (
        <>
            <div className="h-full">
                {data && searchParams.get('view') === 'report' && <ReportPanel
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
                />}
                {data && searchParams.get('view') === 'rejection_email' && (
                    <EmailComposer email={data.data.email} content={data.data.content} subject={data.data.subject}/>

                )}
            </div>

        </>
    )
}