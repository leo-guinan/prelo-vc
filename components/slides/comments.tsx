import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function SlideComments() {
    return (
        <div
            className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Comments</h3>
                <Button size="sm" variant="outline">
                    Add Comment
                </Button>
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <Avatar>
                        <AvatarImage alt="User Avatar" src="/placeholder-user.jpg"/>
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold">John Doe</h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
                        </div>
                        <p className="text-sm">This is a great slide deck! I really like the design and flow of the
                            content.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Avatar>
                        <AvatarImage alt="User Avatar" src="/placeholder-user.jpg"/>
                        <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold">Jane Smith</h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</span>
                        </div>
                        <p className="text-sm">
                            I have a question about slide 5. Can you clarify the point about the product roadmap?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}