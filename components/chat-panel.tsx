import * as React from 'react'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { useState } from 'react'
import { CheckmarkIcon } from './ui/icons'
import { UploadModal } from '@/components/upload-modal'
import { UserWithMemberships } from '@/lib/types'

export interface ChatPanelProps {
    sendMessage: (message: { content: string; role: 'user'; file?: File }, quick?: boolean) => void
    isLoading: boolean
    user: UserWithMemberships
    decks: any[] // Replace 'any' with the correct type for your decks
    onUploadSuccess: (message: string, uuid: string) => void
}

export function ChatPanel({
    sendMessage,
    isLoading,
    user,
    decks,
    onUploadSuccess
}: ChatPanelProps) {
    const [input, setInput] = useState('');
    const [selectedButton, setSelectedButton] = useState<string | null>(null)
    const [selectedSubButton, setSelectedSubButton] = useState<string | null>(null)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadModalMessage, setUploadModalMessage] = useState<string>('Upload a deck to start chatting');

    const proOnlyButtons = [
        'Due Diligence',
    ]

    const buttons = [
        'Email Founders',
        'Share Concerns',
        'List Competitors',
        'Prepare questions',
        'Research Founders',
        'Generate Deal Memo'
    ]

    const subButtons: { [key: string]: string[] } = {
        'Email Founders': ['Rejection Email', 'Book a call', 'Invite Co-Investors', "Request Info"],
        'Share Concerns': ['Traction Concerns', 'Market Size Concerns', 'Team Concerns', 'Product Concerns', 'Competitor Concerns', 'Regulation Concerns'],
        'List Competitors': ['Competitor Matrix', 'Key Differentiator', 'How Much They Raised', 'Competitor Market Share', 'Competitor Prices', 'Target Market'],
        'Prepare questions': ['Competition Questions', 'Go To Market Questions', 'Traction Questions', 'Team Questions', 'Shuffle Questions', 'Moat Questions'],
        'Research Founders': ['Founder Social Media', 'Founder Summary/Bio', 'Founder Domain Experience', 'Why we rate the founder?'],
        'Generate Deal Memo': ['Deal Memo Template', 'Generate Deal Memo', 'Standard Term Sheet']
    }

    const uploadModalMessages: { [key: string]: string } = {
        'Email Founders': 'Upload a pitch deck to generate personalized Emails to founders',
        'Share Concerns': 'Upload a pitch deck to uncover key investment concerns about a deal you\'re considering',
        'List Competitors': 'Upload a pitch deck to gather deep competitor insights and specific market trends',
        'Prepare questions': 'Upload a pitch deck and let PreloVC get you ready for a founder meeting in a few seconds',
        'Research Founders': 'Upload a pitch deck to start a deep-dive founder screening analysis. Get feedback in seconds',
        'Generate Deal Memo': 'Upload a pitch deck to craft a deal memo that give your team the conviction it needs to move forward.'
    };

    const toggleButton = (button: string) => {
        if (decks.length === 0) {
            setUploadModalMessage(uploadModalMessages[button] || 'Upload a deck to start chatting');
            setIsUploadModalOpen(true);
        } else {
            setSelectedButton((prev: string | null) => prev === button ? null : button)
            setSelectedSubButton(null)
        }
    }

    const toggleSubButton = (subButton: string) => {
        if (decks.length === 0) {
            setIsUploadModalOpen(true);
        } else {
            setSelectedSubButton(subButton);
            sendMessage({
                content: `${selectedButton} - ${subButton}`,
                role: 'user'
            }, true);
            setInput('');
        }
    }

    return (
        <div className="sticky bottom-0 w-full z-10 transition-all duration-300 ease-in-out">
            <div className={`transition-all duration-300 ease-in-out ${selectedButton ? 'pb-4' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4 px-4">
                    {selectedButton === null ? (
                        buttons.map(button => (
                            <button
                                key={button}
                                onClick={() => toggleButton(button)}
                                className={`flex flex-row justify-center items-center px-3 py-2 text-sm rounded-lg transition-colors w-full ${
                                    selectedButton === button
                                        ? 'bg-gray-300 text-gray-800'
                                        : 'bg-[#27272A] text-zinc-50'
                                }`}
                            >
                                {button}
                                <CheckmarkIcon className={`w-4 h-4 ml-1 ${
                                    selectedButton === button ? 'text-green-500' : 'text-gray-500'
                                }`} />
                            </button>
                        ))
                    ) : (
                        <>
                            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {subButtons[selectedButton].map(subButton => (
                                    <button
                                        key={subButton}
                                        onClick={() => toggleSubButton(subButton)}
                                        className={`flex flex-row justify-center items-center px-3 py-2 text-sm rounded-lg transition-colors w-full ${
                                            selectedSubButton === subButton
                                                ? 'bg-gray-300 text-gray-800'
                                                : 'bg-[#27272A] text-zinc-50'
                                        } ${proOnlyButtons.includes(subButton) ? 'bg-gray-500 text-gray-400 cursor-not-allowed' : ''}`}
                                        disabled={proOnlyButtons.includes(subButton)}
                                    >
                                        {subButton}
                                        <CheckmarkIcon className={`w-4 h-4 ml-1 ${
                                            selectedSubButton === subButton ? 'text-green-500' : 'text-gray-500'
                                        }`} />
                                    </button>
                                ))}
                            </div>
                            <div className="col-span-full">
                                <button
                                    onClick={() => setSelectedButton(null)}
                                    className="flex flex-row justify-center items-center px-3 py-2 text-sm rounded-lg transition-colors w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                                >
                                    Back
                                </button>
                            </div>
                        </>
                    )}
                </div>
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
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                user={user}
                onUploadSuccess={(message, uuid) => {
                    onUploadSuccess(message, uuid);
                    setIsUploadModalOpen(false);
                }}
                message={uploadModalMessage}
            />
        </div>
    )
}
