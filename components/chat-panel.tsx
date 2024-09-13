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

    const buttons = [
        'Email Founders',
        'Share Concerns',
        'List Competitors',
        'Prepare questions',
        'Research Founders',
        'Generate Deal Memo'
    ]

    const toggleButton = (button: string) => {
        setSelectedButton((prev: string | null) => prev === button ? null : button)
        sendMessage({
            content: button,
            role: 'user'
        })
    }
    return (
        <>



            <div className="sticky bottom-0 w-full ">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4 ">
                    {buttons.map(button => (
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
                    ))}
                </div>
                <div className="bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80 ">
                    <ButtonScrollToBottom />

                    <div className="mr-auto sm:max-w-2xl sm:px-4">

                        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
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
        </>
    )
}