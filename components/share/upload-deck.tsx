'use client'
import { MembershipRole, User } from "@prisma/client/edge"
import { useEffect, useState } from "react"
import FileUpload from "@/components/analyze/file-upload"
import InvestorChat from "./investor-chat"
import { Message, PreloChatMessage } from "@/lib/types"
import { nanoid } from "@/lib/utils"
import useSwr from "swr"
import { getMessages } from "@/app/actions/share"

interface UploadDeckProps {
    user: User & {
        memberships: {
            id: number
            role: MembershipRole
            organizationId: number
            userId: string | null
            invitedName: string | null
            invitedEmail: string | null
        }[]
    }
    messages: PreloChatMessage[]
    uuid: string
}

export default function UploadDeck({ user }: UploadDeckProps) {
    const [uploaded, setUploaded] = useState(false)
    const [conversationUuid, setConversationUuid] = useState<string>("")
    const [displayedMessages, setDisplayedMessages] = useState<PreloChatMessage[]>([])
    const { data: messages } = useSwr(conversationUuid ? [user, conversationUuid] : null, () => getMessages(user, conversationUuid!))

    useEffect(() => {
        let uuid = localStorage.getItem("upload_uuid");
        if (uuid) {
            setConversationUuid(uuid)
            setUploaded(true)
        }
    }, [])

    useEffect(() => {
        if (messages) {
            console.log('Messages', messages)
            setDisplayedMessages(messages)
        }
    }, [messages])


    const handleUploadSuccess = (message: string, uuid: string) => {
        console.log('Upload success')
        setDisplayedMessages([{
            id: nanoid(),
            content: message,
            role: "user",
            type: "text"
        }])
        localStorage.setItem("upload_uuid", uuid)   
        setConversationUuid(uuid)
        setUploaded(true)
        
    }



    return (
        <>
            {uploaded ? (
                <InvestorChat user={user} messages={displayedMessages} uuid={conversationUuid}/>
            ) : (
                <FileUpload user={user} onUploadSuccess={handleUploadSuccess}/>
            )}
        </>
    )
}