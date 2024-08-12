import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import MarkdownBlock from "@/components/ui/markdown-block";
import Image from "next/image";

export default function FAQ({user}: { user: { name?: string | null, image?: string | null } }) {

    const questions = [
        {
            question: "How do I get started? 🚀",
            answer: "Click the yellow button in the chat and upload a deck. Then head over to the left panel and expand \"View Pitch Decks\" to select the recently loaded deck."
        },
        {
            question: "How to bulk load pitch decks? ⬆️",
            answer: "You are currently on the Angel Plan, you'll have to upgrade to the \"Venture Plan\" to load and analyze 100s of decks on autopilot. Send an email to sales@prelovc.com to inquire about the Venture Plan"
        },
        {
            question: "How to train the LLM to think like me? 🧠",
            answer: "The more you engage with the LLM the better it gets at making investment recommendations  based on your thesis and values. "
        },
        {
            question: "How to research founder(s)? 🧑‍🚀",
            answer: "Each pitch deck has the name and contact details of every founder - simply ask the AI to \"Tell me more about the founders\""
        },
        {
            question: "How to share pitch decks? 🤝",
            answer: "On the right hand side of your dashboard, click the share button and copy the link to share with a friend in your network."

        },
    ]

    return (
        <div className="w-full max-w-xl">
            <div className="w-full flex flex-row justify-start items-center mb-4">
                <div className="flex w-1/8">
                    <Image src="/logo.png" width={32} height={32} alt="PreloVC Logo"
                           className="rounded-full"/>
                </div>
                <div className="flex ml-4">
                    Some <span
                    className="text-objections">frequently asked questions </span>to learn
                    more 💡
                </div>

            </div>
            <Accordion type="multiple" className="w-full">
                {questions.map((q, index) => (
                    <AccordionItem value={`question-${index}`} key={`question-${index}`}>
                        <AccordionTrigger iconColor="#8BDDE4">{q.question}</AccordionTrigger>
                        <AccordionContent>
                            <MarkdownBlock content={q.answer}/>
                        </AccordionContent>
                    </AccordionItem>
                ))}


            </Accordion>
        </div>
    )
}