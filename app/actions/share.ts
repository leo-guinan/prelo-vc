'use server'

export async function getSharedReport(deck_uuid:string, report_uuid: string) {
    const getInvestorReportResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/shared/report/`, {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: JSON.stringify({
            report_uuid,
            deck_uuid
        })

    })

    const parsed = await getInvestorReportResponse.json()

    return {
        executive_summary: parsed.executive_summary,
        company_name: parsed.company_name,
    }
}