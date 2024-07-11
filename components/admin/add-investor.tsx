'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export default function AddInvestor() {
    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>Add Investment Firm</CardTitle>
                <CardDescription>Enter the details of the investment firm you want to add.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="firmName">Firm Name</Label>
                        <Input id="firmName" placeholder="Enter firm name"/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="firmWebsite">Firm Website</Label>
                        <Input id="firmWebsite" placeholder="Enter firm website"/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="firmThesis">Firm Thesis</Label>
                        <Textarea id="firmThesis" placeholder="Enter firm thesis or scan website"/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="additionalResources">Additional Resources</Label>
                        <div className="grid gap-2">
                            <Input id="additionalResources" placeholder="Enter website, blog, video, or podcast URL"/>
                            <Button variant="outline" className="w-fit">
                                Add Another
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={(e) => {
                        e.preventDefault()
                    }}
                >
                    Scan Website
                </Button>
                <Button className="ml-auto">Add Firm</Button>
            </CardFooter>
        </Card>
    )
}