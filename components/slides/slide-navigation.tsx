import {ArrowLeftIcon, ArrowRightIcon} from "../ui/icons";
import {Button} from "@/components/ui/button";

export default function SlideNavigation() {
    return (
        <div className="flex justify-between">
            <Button variant="outline">
                <ArrowLeftIcon className="mr-2"/>
                Previous
            </Button>
            <Button variant="outline">
                Next
                <ArrowRightIcon className="ml-2"/>
            </Button>
        </div>

    )
}