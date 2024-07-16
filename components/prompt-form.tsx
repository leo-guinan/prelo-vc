import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import {UseChatHelpers} from 'ai/react'
import {useEnterSubmit} from '@/lib/hooks/use-enter-submit'
import {cn} from '@/lib/utils'
import {Button, buttonVariants} from '@/components/ui/button'
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip'
import {CloudUploadIcon, IconArrowElbow, IconPlus} from '@/components/ui/icons'
import {useRouter} from 'next/navigation'

export interface PromptProps
    extends Pick<UseChatHelpers, 'input' | 'setInput'> {
    onSubmit: (value: string, file?: File | null) => void
    isLoading: boolean
}

export function PromptForm({
                               onSubmit,
                               input,
                               setInput,
                               isLoading
                           }: PromptProps) {
    const {formRef, onKeyDown} = useEnterSubmit()
    const inputRef = React.useRef<HTMLTextAreaElement>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const router = useRouter()
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type === 'application/pdf') {
            onSubmit("Upload file", file)
        } else {
            alert('Please select a PDF file')
            setSelectedFile(null)
        }
    }

    return (
        <form
            onSubmit={async e => {
                e.preventDefault()
                if (!input?.trim() && !selectedFile) {
                    return
                }
                setInput('')
                await onSubmit(input, selectedFile)
                setSelectedFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }}
            ref={formRef}
        >
            <div
                className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={e => {
                                e.preventDefault()
                                router.refresh()
                                router.push('/')
                            }}
                            className={cn(
                                buttonVariants({size: 'sm', variant: 'outline'}),
                                'absolute left-0 top-4 size-8 rounded-full bg-background p-0 sm:left-4'
                            )}
                        >
                            <IconPlus/>
                            <span className="sr-only">New Chat</span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>New Chat</TooltipContent>
                </Tooltip>
                <Textarea
                    ref={inputRef}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask a question 🤔 or upload a deck"
                    spellCheck={false}
                    className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                />
                <div className="absolute right-0 top-4 flex items-center space-x-2 sm:right-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <CloudUploadIcon/>
                                <span className="sr-only">Upload PDF</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Upload PDF</TooltipContent>
                    </Tooltip>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                    /> <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="submit"
                            size="icon"
                            disabled={isLoading || input === ''}
                        >
                            <IconArrowElbow/>
                            <span className="sr-only">Ask a question</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                </Tooltip>
                </div>
            </div>
        </form>
    )
}
