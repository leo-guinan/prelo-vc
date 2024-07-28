'use client'
import Link from "next/link";
import ReportSection from "./report-section";
import {useSearchParams} from "next/navigation";

interface NextStepsSectionProps {
    nextStep: {
        next_step_id: string;
        next_step_description: string;
    }

}

export default function NextStepsSection({nextStep}: NextStepsSectionProps) {

    const searchParams = useSearchParams()
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
    const content = (
        <>
            {nextStep.next_step_id === "1" && (
                <Link
                    className="ml-4 w-4/5 text-base underline text-objections items-center flex"
                    href={`?report_uuid=${searchParams.get('report_uuid')}&deck_uuid=${searchParams.get('deck_uuid')}&view=meeting_email`}>
                    {nextStep.next_step_description}
                </Link>
            )}

            {nextStep.next_step_id === "2" && (
                <p>This deck is in the middle. We would love your feedback on what the next steps should be.</p>
            )}

            {nextStep.next_step_id === "3" && (
                <Link
                    className="ml-4 w-4/5 text-base underline text-objections items-center flex"
                    href={`?report_uuid=${searchParams.get('report_uuid')}&deck_uuid=${searchParams.get('deck_uuid')}&view=rejection_email`}>
                    {nextStep.next_step_description}
                </Link>
            )}
        </>
    )

    // {nextStep.next_step_id === "3" && (

    //                             )}

    return (
        <ReportSection
            value="next_steps"
            title="Recommendation"
            description={description}
            content={content}
        />
    )
}