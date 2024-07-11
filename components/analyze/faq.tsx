import {ChatMessage} from "@/components/chat-message";
import {nanoid} from "@/lib/utils";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import MarkdownBlock from "@/components/ui/markdown-block";

export default function FAQ({user}: { user: { name?: string | null, image?: string | null } }) {

    const questions = [
        {
            question: "How do I get started?",
            answer: "Click \"Analyze New Deck\" on the left panel and upload a deck. Then head over to \"View Pitch Deck\" check out your investment recommendation. "
        },
        {
            question: "How do I bulk load pitch decks?",
            answer: "You are currently on the \"Angel Plan\", you'll have to upgrade to the \"Venture Plan\" and you'll be able to load and analyze 100s of decks on autopilot. Send an email to sales@prelovc.com to inquire about the \"Venture Plan\""
        },
        {
            question: "How do I move pitch decks into my funnel?",
            answer: "On the right panel, Click \"Book Call\" , \"Maybe\" or \"Pass\" on each pitch deck report and see the decks appear in the relevant folder. "
        },
        {
            question: "Can I connect with the founder?",
            answer: "Each pitch deck has the name and contact details of every founder - simply ask the AI to \"write a follow up email to the [founder]\""
        },
        {
            question: "How do I search for decks I'm interested in?",
            answer: "Just use the search bar on the left panel and write in simple language like \"find all the decks that scored 80% this week\""

        },
    ]

    return (
        <div className="w-full max-w-xl">
            <ChatMessage user={user} message={{
                content: "Some **frequently asked questions** while you wait ☕️",
                role: "bot",
                id: nanoid(),
                type:"text"
            }}/>
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