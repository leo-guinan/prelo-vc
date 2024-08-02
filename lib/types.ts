import { Prisma } from "@prisma/client/edge"

export interface PitchDeckScores {

    market: {
        'score': number
        'reason': string
    },
    team: {
        'score': number
        'reason': string
    },
    founder: {
        'score': number
        'reason': string
    },
    product: {
        'score': number
        'reason': string
    },
    traction: {
        'score': number
        'reason': string

    },
    final: {
        'score': number
        'reason': string
    }

}

export type PreloChatMessageType = "text" | "file" | "deck_report"

export interface PreloChatMessage {
    id: string
    content: string
    role: string
    type: string

}

export interface DeckReportMessage extends PreloChatMessage {
    type: "deck_report"
    company_name: string
    deck_uuid: string
    report_uuid: string
    report_summary: string
    recommended_next_steps: {
        next_step_id: string
        next_step_description: string
    }
    deck_score: number
}

export interface FileMessage extends PreloChatMessage {
    type: "file"
    file: File
}

export type Message = DeckReportMessage | PreloChatMessage | FileMessage

export type UserWithMemberships = Prisma.UserGetPayload<{
  include: { memberships: true }
}>
