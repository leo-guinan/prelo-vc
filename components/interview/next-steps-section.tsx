import ReportSection from "./report-section";


export default function NextStepsSection() {

    const description = (<span>Here we want to give you some options on how to proceed.
        Our analysis suggests that most decks are going to be rejected.
        So for next steps you can either
        <br/><br/>
            1. Write a Rejection Email<br/>
            2. Write an Email for more info<br/>
            3. Write an Email to Book a Meeting<br/>
            4. Write an Email to Invite Co-Investors<br/>
            5. Do some Due Diligence on the Founders<br/>
        <br/>
    </span>)

    return (
        <ReportSection
            value="next_steps"
            title="Recommendation"
            description={description}
            content={<></>}
        />
    )
}