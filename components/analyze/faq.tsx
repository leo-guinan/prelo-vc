import {ChatMessage} from "@/components/chat-message";
import {nanoid} from "@/lib/utils";
import CollapsibleSection from "@/components/collapsible-section";

export default function FAQ({user}: { user: { name?: string | null, image?: string | null } }) {

    const questions = [
        {
            question: "How does it work?",
            answer: "Score My Deck uses a combination of machine learning and human expertise to analyze your pitch deck and provide you with a detailed report on how to improve it."
        },
        {
            question: "What is a fundraising copilot?",
            answer: "A fundraising copilot is a tool that helps you improve your pitch deck and increase your chances of raising funds. It provides you with actionable insights and recommendations based on your pitch deck and the latest fundraising trends."
        },
        {
            question: "Can I ask it to find me some investors?",
            answer: "Yes, you can ask Score My Deck to help you find investors. It will provide you with a list of potential investors based on your pitch deck and the latest fundraising trends."
        },
        {
            question: "Can I interact with it like GPT or Gemini?",
            answer: "Yes, you can interact with Score My Deck like GPT or Gemini. It uses natural language processing to understand your questions and provide you with relevant answers."
        },
        {
            question: "Will you be onboarding VCs and Angels?",
            answer: "Yes, we are currently onboarding VCs and Angels to provide you with feedback on your pitch deck. You can also ask Score My Deck to help you find investors based on your pitch deck and the latest fundraising trends."

        },
        {
            question: "Can it write a personalized cold email to a VC?",
            answer: "Yes, Score My Deck can help you write a personalized cold email to a VC. It uses natural language processing to understand your pitch deck and the VC's preferences to craft a compelling email."
        },
    ]

    return (
        <div className="w-full max-w-xl">
            <ChatMessage user={user} message={{
                content: "Some **frequently asked questions** while you wait ☕️",
                role: "bot",
                id: nanoid()
            }}/>
            {questions.map((q, index) => (
                <div key={`question-${index}`}><CollapsibleSection title={q.question} headerColor="howTo-background"
                                                                   iconColor="#8BDDE4">
                    <>
                        <p>{q.answer}</p>
                    </>

                </CollapsibleSection>

                </div>
            ))}
        </div>
    )
}