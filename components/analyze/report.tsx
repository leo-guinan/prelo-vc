import CollapsibleSection from "@/components/collapsible-section";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
//@ts-ignore
import remarkCollapse from "remark-collapse";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import {CodeBlock} from "@/components/ui/codeblock";
import {MemoizedReactMarkdown} from "@/components/markdown";
import {cn} from "@/lib/utils";
import Image from "next/image";
import PitchDeckSummary from "@/components/analyze/pitch-deck-summary";
import Traction from "@/components/analyze/traction";
import Concerns from "@/components/analyze/concerns";
import Believe from "@/components/analyze/believe";
import Recommendation from "@/components/analyze/recommendation";
import {RecommendationOption} from "@/components/analyze/chat";

interface ReportProps {
    pitchDeckSummary: string;
    traction: string;
    concerns: string;
    believe: string;
    recommendation: string
    recommendationOption: RecommendationOption
}

export default function Report({pitchDeckSummary, traction, believe, concerns, recommendation, recommendationOption}: ReportProps) {
    return (
        <div className="relative px-8 mt-8" >
            <div
                className={cn('group relative mb-4 flex flex-col flex-1 items-start w-full')}
            >
                <div className="flex flex-row w-full max-w-xl">
                    <span>Decision: </span>
                    <button className="bg-howTo p-2 rounded-md">
                        Book Call
                    </button>
                    <button className="bg-objections p-2 rounded-md">
                        Maybe
                    </button>
                    <button className="bg-concern p-2 rounded-md">
                        Pass
                    </button>
                </div>

                <div className="flex flex-col w-full max-w-xl">
                    <Recommendation recommendation={recommendation} />
                    <PitchDeckSummary pitchDeckSummary={pitchDeckSummary} />
                    <Traction traction={traction} />
                    <Concerns concerns={concerns}/>
                    <Believe believe={believe} />

                </div>
            </div>
        </div>
    )
}