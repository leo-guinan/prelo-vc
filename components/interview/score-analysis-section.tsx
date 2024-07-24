import ReportSection from "@/components/interview/report-section";

export default function ScoreAnalysisSection() {

    const description = (<span>
        We share how we arrived at each score. We break the scores down based on the numbers shared in the dials. <br/>--<br/>
       <span className="text-concern">0 - 74% is poor </span>this is a NO<br/>
       <span className="text-objections">75% - 84% is ok </span> and it&apos;s a MAYBE<br/>
        <span className="text-howTo">85% - 100% is excellent </span>always a YES</span>)

    return (
        <ReportSection value="score_analysis" title="Score Analysis"
                       description={description}
                       content={<></>}/>
    )
}