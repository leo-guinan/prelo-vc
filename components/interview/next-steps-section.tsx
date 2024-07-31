'use client'
import Link from "next/link";
import ReportSection from "./report-section";
import {useSearchParams} from "next/navigation";
import {MinusIcon} from "../ui/icons";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

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

                <p>This deck is a no. Write a rejection letter to the founders</p>
            )}

            {nextStep.next_step_id === "2" && (
                <p>This deck is a maybe. Request more information from the founders.</p>
            )}

            {nextStep.next_step_id === "3" && (

                <p>This deck is a yes. Invite the founders to have a meeting.</p>

            )}

            <Link
                className="ml-4 w-4/5 text-base underline items-center flex"
                href={`?report_uuid=${searchParams.get('report_uuid')}&deck_uuid=${searchParams.get('deck_uuid')}&view=rejection_email`}>
                write rejection email <MinusIcon className="size-6" overrideColor="#FF7878"/>
            </Link>
            <Link
                className="ml-4 w-4/5 text-base underline items-center flex"
                href={`?report_uuid=${searchParams.get('report_uuid')}&deck_uuid=${searchParams.get('deck_uuid')}&view=more_info_email`}>
                write email for more info
            </Link>
            <Link
                className="ml-4 w-4/5 text-base underline items-center flex"
                href={`?report_uuid=${searchParams.get('report_uuid')}&deck_uuid=${searchParams.get('deck_uuid')}&view=meeting_email`}>
                write email to book meeting 🗓️
            </Link>
            <Link
                className="ml-4 w-4/5 text-base underline items-center flex"
                href={`?report_uuid=${searchParams.get('report_uuid')}&deck_uuid=${searchParams.get('deck_uuid')}&view=coinvestor_email`}>
                write email to invite co-investors
            </Link>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="ml-4 w-4/5 text-base underline items-center flex">start due diligence on the founders ❓</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-left">
                            <p className="break-words">This is available for white-label implementations only. Please contact support to learn more.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

        </>
    )



    return (
        <ReportSection
            value="next_steps"
            title="Recommendation"
            description={description}
            content={content}
        />
    )
}