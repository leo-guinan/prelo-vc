import * as React from 'react'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { useState } from 'react'
import { CheckmarkIcon } from './ui/icons'

export interface ChatPanelProps {
    input: string
    setInput: React.Dispatch<React.SetStateAction<string>>
    sendMessage: (message: { content: string; role: 'user'; file?: File }) => void
    isLoading: boolean
}

export function ChatPanel({
    input,
    setInput,
    sendMessage,
    isLoading
}: ChatPanelProps) {

    const [selectedButton, setSelectedButton] = useState<string | null>(null)
    const [selectedSubButton, setSelectedSubButton] = useState<string | null>(null)

    const buttons = [
        'Email Founders',
        'Share Concerns',
        'List Competitors',
        'Prepare questions',
        'Research Founders',
        'Generate Deal Memo'
    ]

    const subButtons: { [key: string]: string[] } = {
        'Email Founders': ['Rejection Email', 'Follow Up Email', 'Book a call', 'Invite Co-Investors', "Request Info"],
        'Share Concerns': ['To Investors', 'As Outline', 'As Questions'],
        'List Competitors': ['With Funding', 'Without Funding', 'As Questions'],
        'Prepare questions': ['To Founders', 'To Investors', 'To Team', 'To Me'],
        'Research Founders': ['Twitter', 'LinkedIn'],
        'Generate Deal Memo': ['From Firm', 'From Me']
    }

    const toggleButton = (button: string) => {
        setSelectedButton((prev: string | null) => prev === button ? null : button)
        setSelectedSubButton(null)
    }

    const toggleSubButton = (subButton: string) => {
        setSelectedSubButton(subButton)
        sendMessage({
            content: `${selectedButton} - ${subButton}`,
            role: 'user'
        })
    }

    return (
        <div className="sticky bottom-0 w-full z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4 px-4">
                {selectedButton === null ? (
                    buttons.map(button => (
                        <button
                            key={button}
                            onClick={() => toggleButton(button)}
                            className={`flex flex-row justify-center items-center px-3 py-2 text-sm rounded-lg transition-colors w-full ${selectedButton === button
                                ? 'bg-gray-300 text-gray-800'
                                : 'bg-[#27272A] text-zinc-50'
                                }`}
                        >
                            {button}
                            {selectedButton !== button && (
                                <>
                                    <CheckmarkIcon className="w-4 h-4 ml-1 text-gray-500" />
                                </>
                            )}
                            {selectedButton === button && (
                                <>
                                    <CheckmarkIcon className="w-4 h-4 ml-1 text-green-500" />
                                </>
                            )}
                        </button>
                    ))
                ) : (
                    <>
                        {subButtons[selectedButton].map(subButton => (
                            <button
                                key={subButton}
                                onClick={() => toggleSubButton(subButton)}
                                className={`flex flex-row justify-center items-center px-3 py-2 text-sm rounded-lg transition-colors w-full ${selectedSubButton === subButton
                                    ? 'bg-gray-300 text-gray-800'
                                    : 'bg-[#27272A] text-zinc-50'
                                    }`}
                            >
                                {subButton}
                                {selectedSubButton !== subButton && (
                                    <>
                                        <CheckmarkIcon className="w-4 h-4 ml-1 text-gray-500" />
                                    </>
                                )}
                                {selectedSubButton === subButton && (
                                    <>
                                        <CheckmarkIcon className="w-4 h-4 ml-1 text-green-500" />
                                    </>
                                )}
                            </button>
                        ))}
                        <button
                            onClick={() => setSelectedButton(null)}
                            className="flex flex-row justify-center items-center px-3 py-2 text-sm rounded-lg transition-colors w-full bg-indigo-600 hover:bg-indigo-500 text-white text-zinc-50"
                        >
                            Back
                        </button>
                    </>
                )}
            </div>
            <div className="bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80">
                <ButtonScrollToBottom />
                <div className="mx-auto max-w-2xl px-4">
                    <div className="py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
                        <PromptForm
                            onSubmit={async (value: string, file?: File | null) => {
                                await sendMessage({
                                    content: value,
                                    role: 'user',
                                    ...(file && { file })
                                })
                            }}
                            input={input}
                            setInput={setInput}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}