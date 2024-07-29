'use server'

export async function viewReport(deckUUID: string, reportUUID: string) {
    const getInvestorReportResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/report/`, {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: JSON.stringify({
            deck_uuid: deckUUID,
            report_uuid: reportUUID
        })

    })
    const parsed = await getInvestorReportResponse.json()

    return {
        companyName: parsed.company_name,
        summary:  parsed.summary,
        believe: parsed.believe,
        traction: parsed.traction,
        concerns: JSON.parse(parsed.concerns).concerns,
        investmentScore: parsed.investment_potential_score,
        amountRaising: parsed.amount_raising,
        recommendation: parsed.recommendation_reasons,
        nextStep: JSON.parse(parsed.recommended_next_steps),
        executiveSummary: parsed.executive_summary,
        founders: JSON.parse(parsed.founders),
        scores: parsed.scores,
        founderContactInfo: JSON.parse(parsed.founders_contact_info).results,
        scoreExplanation: parsed.score_explanation
    }
}