import SlideNavigation from "@/components/slides/slide-navigation";
import SlideAnalysis from "@/components/slides/analysis";
import SlideComments from "@/components/slides/comments";

export default function PitchDeckViewer() {
    return (
        <div className="flex flex-col ">
            <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto ">

                <div className="w-full md:w-2/3 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-950">
                    <div className="p-6">
                        <img
                            alt="Slide Image"
                            className="w-full h-auto rounded-lg"
                            height="450"
                            src="/placeholder.svg"
                            style={{
                                aspectRatio: "800/450",
                                objectFit: "cover",
                            }}
                            width="800"
                        />
                    </div>
                </div>
                <div className="w-full md:w-1/3 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-950">
                    <SlideAnalysis/>
                    <SlideNavigation/>
                </div>

            </div>
            <div className="flex flex-col w-full mx-auto max-w-5xl pt-2">
                <SlideComments/>
            </div>
        </div>
    )
}