import {CircularProgressBar} from "@/components/analyze/score";
import Link from "next/link";
import {type DeckReportMessage} from "@/lib/types";

export function DeckReportMessage({message}: { message: DeckReportMessage }) {

    const determineMessage = (message: DeckReportMessage) => {
        switch (message.recommended_next_steps.next_step_id) {
            case "1":
            case 1:
                return `${message.company_name} is a great investment opportunity for you. Read this report to find out why. 👉`
            case "2":
            case 2:
                return `${message.company_name} could be an investment opportunity. Read this report to find out why. 👉`
            case "3":
            case 3:
                return `${message.company_name} is not an investment opportunity at this point. Read this report to find out why. 👉`
            default:
                return "Unknown message type. Please contact support."

        }
    }

    const displayMessage = determineMessage(message)

    return (
        <>
            <Link href={`?report_uuid=${message.report_uuid}&deck_uuid=${message.deck_uuid}&view=report`}>
                <div className="flex flex-row justify-between items-start">
                    <div className="flex w-3/5">{displayMessage} </div>
                    <div className="align-top"><CircularProgressBar title="Read Report" progress={message.deck_score}/>
                    </div>
                </div>

            </Link>
        </>
    )
}