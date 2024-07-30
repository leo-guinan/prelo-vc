'use client';
import {ScrollArea} from "@/components/ui/scroll-area";
import MarkdownBlock from "@/components/ui/markdown-block";
import {Banner} from "@/components/share/banner";
import Link from "next/link";
import {Button, buttonVariants} from "../ui/button";
import {IconCheck, IconCopy, IconShare} from "@/components/ui/icons";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import {useCopyToClipboard} from "@/lib/hooks/use-copy-to-clipboard";

interface SharedReportProps {
    report: string
    company_name: string
    reportUUID: string
    deckUUID: string

}

export default function SharedReport({report, company_name, deckUUID, reportUUID}: SharedReportProps) {
    const copyShareLink = () => {
        if (isCopied) return
        copyToClipboard(`${window.location.origin}/share/${deckUUID}/${reportUUID}`)
    }
    const {isCopied, copyToClipboard} = useCopyToClipboard({timeout: 2000})

    return (
        <div className="relative">
            <Banner/>

            <div className="container w-full max-w-3xl mx-auto mt-24">
                <div className={'pt-4 md:pt-10 size-full mx-auto box-border'}>

                    <div className="flex flex-col-reverse sm:flex-row h-full">
                        <ScrollArea className="flex flex-col size-full pb-8">
                            <MarkdownBlock content={report}/>
                        </ScrollArea>

                    </div>
                    <div className="flex flex-row space-x-4">

                        <Link href={`/login?redirect=/view/${deckUUID}/${reportUUID}`}
                        >
                            <Button
                                className="rounded bg-objections px-6 py-3 h-10 text-sm font-semibold text-standard shadow-sm hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
                                Create Account
                            </Button>
                        </Link>

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
                                        <MarkdownBlock content={report}/>
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
                    </div>

                </div>
            </div>
        </div>
    )
}