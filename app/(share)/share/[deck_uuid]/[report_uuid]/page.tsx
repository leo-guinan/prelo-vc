import {getSharedReport} from "@/app/actions/share";
import SharedReport from "@/components/share/shared-report";

interface PitchDeckPageProps {
    params: {
        deck_uuid: string
        report_uuid: string
    }
}

export default async function SharedDeckReportPage({params}: PitchDeckPageProps) {

    const {executive_summary, company_name} = await getSharedReport(params.deck_uuid, params.report_uuid)

    return <SharedReport report={executive_summary} company_name={company_name}/>
}
