import {Accordion} from "@/components/ui/accordion";
import {Founder} from "@/components/panel/founder-list";
import Scores from "@/components/analyze/scores";
import NextStepsSection from "@/components/interview/next-steps-section";
import ScoreAnalysisSection from "@/components/interview/score-analysis-section";
import InvestorConcernsSection from "@/components/interview/investor-concerns-section";
import PitchDeckSummarySection from "@/components/interview/pitch-deck-summary-section";
import {useState} from "react";
import {Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import {DialogContent, DialogTrigger} from "@/components/ui/dialog";
import MarkdownBlock from "../ui/markdown-block";
import {Button, buttonVariants} from "../ui/button";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {useCopyToClipboard} from "@/lib/hooks/use-copy-to-clipboard";
import {IconCheck, IconCopy, IconShare} from "@/components/ui/icons";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {User} from "@prisma/client/edge";
import {ScrollArea} from "@/components/ui/scroll-area";


interface ReportPanelProps {
    pitchDeckSummary: string;
    traction: string;
    concerns: {
        title: string;
        concern: string;
    }[];
    believe: string;
    recommendation: string
    companyName: string;
    amountRaising: string;
    investmentScore: number;
    nextStep: {
        next_step_id: string;
        next_step_description: string;
    },
    founders: Founder[],
    scores: {
        market: {
            score: number
            reason: string
        },
        team: {
            score: number
            reason: string
        },
        product: {
            score: number
            reason: string
        },
        traction: {
            score: number
            reason: string

        },
        final: {
            score: number
            reason: string
        }
    }
    founderContactInfo: {
        email: string
    },
    scoreExplanation: Record<string, string>
    deck_uuid: string
    report_uuid: string
    user: User

}

export default function ReportPanel({
                                        pitchDeckSummary,
                                        traction,
                                        concerns,
                                        companyName,
                                        amountRaising,
                                        nextStep,
                                        founders,
                                        scores,
                                        scoreExplanation,
                                        deck_uuid,
                                        report_uuid,
                                        user

                                    }: ReportPanelProps) {

    const [openSections, setOpenSections] = useState<string[]>([]);
    const {isCopied, copyToClipboard} = useCopyToClipboard({timeout: 2000})

    const toggleSection = (value: string) => {
        setOpenSections(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        );
    };

    const copyShareLink = async () => {
        if (isCopied) return
        copyToClipboard(`${window.location.origin}/share/${deck_uuid}/${report_uuid}`)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col justify-center items-center">
                <h1 className="flex align-middle justify-center items-center text-3xl font-bold text-center mr-2">{companyName}</h1>
                <div className="flex flex-row justify-center gap-x-2 my-2">
                    <Dialog>
                        <DialogTrigger>
                            <>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="button" variant="default"
                                                    className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                                <IconShare className="mr-2"/>
                                                <span>Share</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p className="break-words">Share with another investor</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                            </>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Share This Deal</DialogTitle>
                                <DialogDescription>

                                </DialogDescription>
                            </DialogHeader>
                            <div className="h-96 overflow-y-scroll">
                                <ScrollArea>
                                    <MarkdownBlock content={pitchDeckSummary}/>
                                </ScrollArea>
                            </div>
                            <DialogFooter className="sm:justify-start">

                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" className="p-4 h-10">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Link
                                    onClick={copyShareLink}
                                    href="#"
                                    className={cn(
                                        buttonVariants({variant: 'outline'}),
                                        'h-10 text-zinc-50 dark:text-gray-900 justify-start bg-standard dark:bg-gray-100 p-4 shadow-none transition-colors hover:bg-gray-100 hover:text-gray-900  dark:hover:bg-standard dark:hover:text-zinc-50'
                                    )}
                                >
                                    {isCopied ? <IconCheck/> : <IconCopy/>}
                                    Copy Share Link
                                </Link>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {!user?.activated && (
                        <Dialog>
                            <DialogTrigger>
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="default"
                                                        className="rounded bg-objections px-2 py-1 text-sm font-semibold text-standard shadow-sm hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                                    <span>Activate Account</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                                <p className="break-words">Activate your account</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                </>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Activate your account</DialogTitle>
                                    <DialogDescription>

                                    </DialogDescription>
                                </DialogHeader>
                                <>
                                    <p>During our closed beta, we want to talk to you in order to understand your needs
                                        better.
                                    </p>
                                    <div>
                                        <a href="https://meetings.hubspot.com/olu-adedeji" target="_blank"
                                           rel='noopener noreferrer'
                                           className="text-objections underline cursor-pointer"> Book a call with us
                                            here.</a>
                                    </div>

                                </>
                                <DialogFooter className="sm:justify-start">

                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary" className="p-4 h-10">
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="container max-w-xl w-full justify-center">
                        <Scores scores={scores}/>

                        <Accordion type="multiple" className="mt-8 max-w-xl">

                            <PitchDeckSummarySection pitchDeckSummary={scores.final.reason} traction={traction}
                                                     founders={founders} amountRaising={amountRaising}
                            />

                            <InvestorConcernsSection concerns={concerns}

                            />

                            <ScoreAnalysisSection scoreExplanation={scoreExplanation}

                            />


                            <NextStepsSection
                                nextStep={nextStep}
                            />

                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    )
}