'use client'
import {CircularProgressBar} from "@/components/analyze/score";
import Link from "next/link";
import {type DeckReportMessage} from "@/lib/types";

export function DeckReportMessage({message}: {message: DeckReportMessage}) {
    console.log("Message: ", message)
    return (
        <>
            <Link href={`?report_uuid=${message.report_uuid}&deck_uuid=${message.deck_uuid}&view=report`}>
                <div className="flex flex-row">
                    <div className="flex w-4/5">{message.report_summary} </div>
                    <div><CircularProgressBar title="Read Report" progress={message.deck_score}/></div>
                </div>

            </Link>
        </>
    )
}