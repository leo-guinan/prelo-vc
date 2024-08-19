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


export default function SampleReportPanel() {
    const {isCopied, copyToClipboard} = useCopyToClipboard({timeout: 2000})

    const companyName = "Beehiiv (Sample)"
    const pitchDeckSummary = "**Beehiiv - Executive Summary ✍️**\n" +
        "\n" +
        "Beehiv empowers creators to build, grow, and monetize their audience via advanced email newsletter tools.\n" +
        "\n" +
        "Market size: The creator economy is growing at 10-15% annually, with U.S. internet creators earning $7 billion in 2017.\n" +
        "\n" +
        "**Traction 📈**\n" +
        "- Developed top-tier newsletter tools for Morning Brew, acquired for $75 million\n" +
        "- Positive feedback from beta users\n" +
        "- Clear development and launch roadmap\n" +
        "\n" +
        "**Founder(s) 🚀**\n" +
        "- **Tyler Denk (CEO):** Former Morning Brew and Google, expert in email and publications\n" +
        "- **Benjamin Hargett (Co-CTO):** Former Morning Brew and N2 Publishing, strong technical and publishing background\n" +
        "\n" +
        "**Investment Ask 💵**\n" +
        "Seeking $1.3M in pre-seed funding for an 18-month runway, hiring 10 engineers, and scaling the platform using SendGrid, AWS, and Heroku.\n" +
        "use-copy-to-clipboard.tsx:1 traction ### Summary: Traction, Team, and Total Addressable Market (TAM) for beehiv\n" +
        "\n" +
        "#### Traction\n" +
        "**Current State and Growth Potential:**\n" +
        "- **Market Opportunity:** The creator economy is rapidly expanding, and email newsletters are seeing increased popularity, indicating strong market demand.\n" +
        "- **Platform Capabilities:** beehiv offers a comprehensive suite of tools for content creation, monetization, analysis, and growth, tailored to the needs of creators. These tools include advanced customization, paid subscriptions, ad-supported revenue models, and detailed analytics.\n" +
        "- **User Feedback and Beta Testing:** Positive feedback from beta users and a structured timeline for development, closed beta, open beta, and launch phases show a methodical approach to product refinement and user acquisition.\n" +
        "- **Financial Projections:** The company expects to become profitable within the first 12 months, with a projected ARR of $7.35 million by month 18 and over $250,000 in monthly profit by month 18.\n" +
        "- **Competitive Edge:** The platform integrates functionalities from well-known services (e.g., Webflow, Medium, Substack, LiveIntent, Morning Brew, Netflix) to offer a superior, all-encompassing solution. It also provides features that other platforms lack, such as no fees on subscription revenue and a targeted ad network.\n" +
        "- **Market Validation:** Significant industry interest and investment in the newsletter space, with notable acquisitions (e.g., Morning Brew, The Hustle) and substantial funding rounds (e.g., Substack, The Skimm).\n" +
        "\n" +
        "#### Team\n" +
        "**Founding Team and Expertise:**\n" +
        "- **Tyler Denk (Cofounder and CEO):** Previously worked at Morning Brew and Google, bringing valuable experience in email and publications.\n" +
        "- **Benjamin Hargett (Cofounder and Co-CTO):** Formerly at Morning Brew and N2 Publishing, with extensive technical expertise in email and publications.\n" +
        "- **Proven Track Record:** The team has previously developed top-tier newsletter tools and technology for Morning Brew, which was acquired for $75 million, demonstrating their capability and success in the field.\n" +
        "- **Technical Proficiency:** Both cofounders are technical, with years of experience working together, enhancing their ability to execute the company's vision and handle the technical complexities of the platform.\n" +
        "\n" +
        "#### Total Addressable Market (TAM)\n" +
        "**Market Size and Growth:**\n" +
        "- **Creator Economy Landscape:** The creator economy is divided into ad-supported platforms (e.g., YouTube, Twitch, Instagram, TikTok) and direct/subscription platforms (e.g., Patreon, Substack, Gumroad, Cameo, OnlyFans).\n" +
        "- **Financial Data:** American internet creators earned approximately $7 billion in 2017, with the market growing at an estimated rate of 10-15% year-over-year.\n" +
        "- **Newsletter Industry:** The newsletter space is experiencing significant growth, with major players like Twitter and Facebook entering the market, and platforms like Substack seeing substantial user engagement and investment.\n" +
        "- **Advertising Market:** Email advertising is highly effective, with high engagement rates and willingness from marketers to pay a premium for ads in newsletters. Native ads within high-engagement newsletters (e.g., Morning Brew, The Hustle, The Skimm) are particularly effective.\n" +
        "\n" +
        "**Investor Insight:**\n" +
        "- **Democratization of Resources:** beehiv aims to democratize access to high-quality tools and resources typically available only to large publications, leveling the playing field for individual creators.\n" +
        "- **Scalable Business Model:** The combination of SaaS and an ad network creates a diversified revenue model. The tiered pricing structure and low entry barriers can attract a broad range of creators, while the ad network's zero marginal cost enhances profitability.\n" +
        "- **Funding and Growth:** The company is seeking $1.3 million in pre-seed funding to cover scaling costs, hire key personnel, and capture significant market share, aiming to reach \"escape velocity\" without capital restrictions.\n" +
        "\n" +
        "In summary, beehiv presents a compelling investment opportunity with a strong team, a scalable and comprehensive platform, and significant market potential in the rapidly growing creator economy and newsletter industry."
    const traction = "### Summary: Traction, Team, and Total Addressable Market (TAM) for beehiv\n" +
        "\n" +
        "#### Traction\n" +
        "**Current State and Growth Potential:**\n" +
        "- **Market Opportunity:** The creator economy is rapidly expanding, and email newsletters are seeing increased popularity, indicating strong market demand.\n" +
        "- **Platform Capabilities:** beehiv offers a comprehensive suite of tools for content creation, monetization, analysis, and growth, tailored to the needs of creators. These tools include advanced customization, paid subscriptions, ad-supported revenue models, and detailed analytics.\n" +
        "- **User Feedback and Beta Testing:** Positive feedback from beta users and a structured timeline for development, closed beta, open beta, and launch phases show a methodical approach to product refinement and user acquisition.\n" +
        "- **Financial Projections:** The company expects to become profitable within the first 12 months, with a projected ARR of $7.35 million by month 18 and over $250,000 in monthly profit by month 18.\n" +
        "- **Competitive Edge:** The platform integrates functionalities from well-known services (e.g., Webflow, Medium, Substack, LiveIntent, Morning Brew, Netflix) to offer a superior, all-encompassing solution. It also provides features that other platforms lack, such as no fees on subscription revenue and a targeted ad network.\n" +
        "- **Market Validation:** Significant industry interest and investment in the newsletter space, with notable acquisitions (e.g., Morning Brew, The Hustle) and substantial funding rounds (e.g., Substack, The Skimm).\n" +
        "\n" +
        "#### Team\n" +
        "**Founding Team and Expertise:**\n" +
        "- **Tyler Denk (Cofounder and CEO):** Previously worked at Morning Brew and Google, bringing valuable experience in email and publications.\n" +
        "- **Benjamin Hargett (Cofounder and Co-CTO):** Formerly at Morning Brew and N2 Publishing, with extensive technical expertise in email and publications.\n" +
        "- **Proven Track Record:** The team has previously developed top-tier newsletter tools and technology for Morning Brew, which was acquired for $75 million, demonstrating their capability and success in the field.\n" +
        "- **Technical Proficiency:** Both cofounders are technical, with years of experience working together, enhancing their ability to execute the company's vision and handle the technical complexities of the platform.\n" +
        "\n" +
        "#### Total Addressable Market (TAM)\n" +
        "**Market Size and Growth:**\n" +
        "- **Creator Economy Landscape:** The creator economy is divided into ad-supported platforms (e.g., YouTube, Twitch, Instagram, TikTok) and direct/subscription platforms (e.g., Patreon, Substack, Gumroad, Cameo, OnlyFans).\n" +
        "- **Financial Data:** American internet creators earned approximately $7 billion in 2017, with the market growing at an estimated rate of 10-15% year-over-year.\n" +
        "- **Newsletter Industry:** The newsletter space is experiencing significant growth, with major players like Twitter and Facebook entering the market, and platforms like Substack seeing substantial user engagement and investment.\n" +
        "- **Advertising Market:** Email advertising is highly effective, with high engagement rates and willingness from marketers to pay a premium for ads in newsletters. Native ads within high-engagement newsletters (e.g., Morning Brew, The Hustle, The Skimm) are particularly effective.\n" +
        "\n" +
        "**Investor Insight:**\n" +
        "- **Democratization of Resources:** beehiv aims to democratize access to high-quality tools and resources typically available only to large publications, leveling the playing field for individual creators.\n" +
        "- **Scalable Business Model:** The combination of SaaS and an ad network creates a diversified revenue model. The tiered pricing structure and low entry barriers can attract a broad range of creators, while the ad network's zero marginal cost enhances profitability.\n" +
        "- **Funding and Growth:** The company is seeking $1.3 million in pre-seed funding to cover scaling costs, hire key personnel, and capture significant market share, aiming to reach \"escape velocity\" without capital restrictions.\n" +
        "\n" +
        "In summary, beehiv presents a compelling investment opportunity with a strong team, a scalable and comprehensive platform, and significant market potential in the rapidly growing creator economy and newsletter industry."
    const founders: Founder[] = [
    {
        "name": "Tyler Denk",
        "linkedin": "https://www.linkedin.com/in/tyler-denk",
        "twitter": "https://twitter.com/denk_tweets"
    },
    {
        "name": "Benjamin Hargett",
        "linkedin": "https://www.linkedin.com/in/hargettbenjamin",
        "twitter": "https://twitter.com/hargettly?lang=en"
    }
]
    const amountRaising = "$1.3 million"
    const scores = {
    "market": {
        "score": 75,
        "reason": "The creator economy is rapidly growing, and there is a clear demand for better tools to help creators monetize their audience. However, the market is highly competitive with established players like Substack, Medium, and Mailchimp."
    },
    "team": {
        "score": 85,
        "reason": "The founding team’s experience with Morning Brew, a successful newsletter platform, is a strong indicator of their capability to build and scale beehiv."
    },
    "product": {
        "score": 78,
        "reason": "beehiv’s platform offers a comprehensive feature set that integrates the best aspects of various successful platforms. The focus on democratizing access to high-quality tools for creators is a strong value proposition."
    },
    "traction": {
        "score": 70,
        "reason": "Positive initial feedback from beta users and a seamless migration plan are promising. However, the company is still in its early stages and needs to demonstrate sustained traction."
    },
    "final": {
        "score": 75,
        "reason": "Beehiv aligns well with the investor's thesis of funding pre-seed companies, particularly in the B2B SaaS space. The company is tackling a growing market within the creator economy and offers a comprehensive platform that addresses key pain points for newsletter creators. The founding team has a proven track record and relevant expertise, which adds to the investment appeal. However, concerns about market saturation, high competition, and the viability of the revenue model temper the overall investment potential."
    }
}
    const concerns =[
    {
        "title": "Market Saturation",
        "concern": "The market for email newsletter platforms is becoming increasingly saturated with established players like Substack, Revue, and Mailchimp. Investors might worry about beehiv's ability to differentiate itself and capture significant market share."
    },
    {
        "title": "High Competition",
        "concern": "Competing against well-funded and established companies such as Substack, which has raised significant capital and acquired a large user base, could be a major challenge. Investors might question whether beehiv can effectively compete and attract users."
    },
    {
        "title": "Revenue Model Viability",
        "concern": "While the business model combines SaaS and Ad Network revenue streams, there is a concern about the viability and scalability of this model, especially in attracting advertisers and ensuring consistent ad revenue."
    },
    {
        "title": "User Acquisition and Retention",
        "concern": "Gaining and retaining users in a competitive market could be challenging. Investors might be concerned about the costs associated with user acquisition and the strategies in place to ensure long-term user retention."
    },
    {
        "title": "Technical and Operational Execution",
        "concern": "The success of beehiv relies heavily on its technical and operational execution. Any issues in platform stability, user experience, or scalability could significantly impact its growth and investor confidence."
    }
]
    const scoreExplanation = {
    "market": "The market opportunity for beehiv is strong, given the rapid growth of the creator economy and the increasing popularity of email newsletters. The company's comprehensive feature set addresses specific pain points in the market, providing a competitive advantage. However, the presence of established competitors like Substack and the challenges of user acquisition and retention slightly diminish the score.",
    "team": "The team has significant relevant industry experience, particularly with the cofounders' background at Morning Brew, which adds credibility. They possess complementary skill sets necessary for the business, and their track record of success is demonstrated through their previous achievements. However, there may be some uncertainty regarding the depth of the team's experience in scaling a startup in a competitive landscape, which prevents a perfect score.",
    "product": "The product offers a comprehensive solution for creators, addressing specific pain points with existing platforms. Its unique features and positive user feedback indicate strong potential. However, challenges in user acquisition, competition, and scalability slightly hinder the score.",
    "traction": "The company has shown some initial traction with positive user feedback from beta users and commitments from current Substack users. However, there is no current revenue or user base data provided, which limits the score. The growth rate is not explicitly mentioned, but the financial projections indicate a path to profitability within 12 months, suggesting potential for growth. There are no strategic partnerships or pilot programs mentioned, which also affects the score."
}
    const nextStep = {
    "next_step_id": "2",
    "next_step_description": "Learn more about the company"
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
                                    onClick={() => console.log("Sharing")}
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
                                sample={true}
                            />

                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    )
}