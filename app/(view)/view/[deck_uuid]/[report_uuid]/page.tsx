import {getSharedReport} from "@/app/actions/share";
import { auth } from "@/auth";
import SharedReport from "@/components/share/shared-report";
import ViewReport from "@/components/view/report";
import {formatToday} from "@/lib/utils";
import {redirect} from "next/navigation";
import {viewReport} from "@/app/actions/view";
import {Founder} from "@/components/panel/founder-list";

interface PitchDeckPageProps {
    params: {
        deck_uuid: string
        report_uuid: string
    }
}

export default async function ViewDeckReportPage({params}: PitchDeckPageProps) {

    const session = await auth()

    if (!session?.user) {
        redirect(`/sign-in?next=/view/${params.deck_uuid}/${params.report_uuid}`)
    }

    const {
        companyName,
        concerns,
        believe,
        amountRaising,
        recommendation,
        investmentScore,
        traction,
        nextStep,
        founders,
        scores,
        founderContactInfo,
        scoreExplanation,
        summary
    } = await viewReport(params.deck_uuid, params.report_uuid)

    return <ViewReport

        companyName={companyName}
        summary={summary}
    concerns={concerns}
    believe={believe}
    amountRaising={amountRaising}
    recommendation={recommendation}
    investmentScore={investmentScore}
    traction={traction}
    nextStep={nextStep}
    founders={founders}
    scores={scores}
    founderContactInfo={founderContactInfo}
    scoreExplanation={scoreExplanation}


    />
}
