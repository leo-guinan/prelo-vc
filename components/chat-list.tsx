import { type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import {AnalysisChatMessage} from "@/lib/types";

export interface ChatList {
  messages: AnalysisChatMessage[]
  user: {
    name?: string | null
    image?: string | null
  }
}

export function ChatList({ messages, user }: ChatList) {

  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 mt-8">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} user={user} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}
