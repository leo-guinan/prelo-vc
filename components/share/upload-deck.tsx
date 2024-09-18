'use client'
import { MembershipRole, User } from "@prisma/client/edge"
import { useEffect, useState, useCallback } from "react"
import FileUpload from "@/components/analyze/file-upload"
import InvestorChat from "./investor-chat"
import { Message, PreloChatMessage, UserWithMemberships } from "@/lib/types"
import { nanoid } from "@/lib/utils"
import useSwr from "swr"
import { getMessages } from "@/app/actions/share"

interface UploadDeckProps {
    user: UserWithMemberships 
}

export default function UploadDeck({ user }: UploadDeckProps) {
    const [uploaded, setUploaded] = useState(false)
    const [conversationUuid, setConversationUuid] = useState<string>("")
    const [displayedMessages, setDisplayedMessages] = useState<PreloChatMessage[]>([])
    const { data: messages, mutate } = useSwr(
        conversationUuid ? [user.slug, conversationUuid] : null, 
        () => getMessages(user, conversationUuid!)
    )

    useEffect(() => {
        let uuid = localStorage.getItem("upload_uuid");
        if (uuid) {
            setConversationUuid(uuid)
            setUploaded(true)
        }
    }, [])

    useEffect(() => {
        if (messages) {
            setDisplayedMessages(messages)
        }
    }, [messages])

    const handleUploadSuccess = useCallback((message: string, uuid: string) => {
        console.log('Upload success')
        const newMessage = {
            id: nanoid(),
            content: message,
            role: "assistant",
            type: "text"
        }
        setDisplayedMessages([newMessage])
        mutate([newMessage], false) // Update the SWR cache
        const lookupUUID = `${user.slug}_${uuid}`
        localStorage.setItem(`${user.slug}_upload_uuid`, lookupUUID)   
        setConversationUuid(uuid)
        setUploaded(true)
    }, [mutate])

    return (
        <div className="flex flex-col h-screen" >
            {uploaded ? (
                <InvestorChat 
                    user={user} 
                    messages={displayedMessages} 
                    uuid={conversationUuid}
                    onMessagesUpdate={setDisplayedMessages} // New prop
                />
            ) : (
                <FileUpload user={user} onUploadSuccess={handleUploadSuccess}/>
            )}
        </div>
    )
}