import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '../ui/alert-dialog'
import {CheckmarkIcon} from "@/components/ui/icons";

export default function AnalysisCompletedModal({open, setOpen}: { open: boolean, setOpen: (value:boolean) => void }) {

    return (
        <AlertDialog open={open} onOpenChange={(value)=>setOpen(value)}>
            <AlertDialogContent className="flex flex-col items-center justify-center bg-muted/50 ">
                <AlertDialogHeader>
                    <AlertDialogTitle className="pt-16 pb-8"><CheckmarkIcon className="size-24 mx-auto" overrideColor="#60B258"/></AlertDialogTitle>
                    <AlertDialogDescription className="text-3xl font-extrabold pb-8 text-gray-900 dark:text-zinc-50">
                        Deck Analysis Completed
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pb-16">
                    <AlertDialogAction className="rounded-full bg-[#60B258] text-3xl py-6">Get Started</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
