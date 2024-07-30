import {getSharedReport} from "@/app/actions/share";
import { auth } from "@/auth";
import SharedReport from "@/components/share/shared-report";
import { User } from "@prisma/client/edge";

interface PitchDeckPageProps {
    params: {
        deck_uuid: string
        report_uuid: string
    }
}

export default async function SharedDeckReportPage({params}: PitchDeckPageProps) {

    const {executive_summary, company_name} = await getSharedReport(params.deck_uuid, params.report_uuid)
    const session = await auth()
    return <SharedReport report={executive_summary} company_name={company_name} reportUUID={params.report_uuid}
                         deckUUID={params.deck_uuid} user={session?.user as User}/>
}
