import { IRecord } from '$/types'

export interface IMessage extends IRecord {
    content: string
    createdBy: string
    id: string
    roomId: string
}

export enum MessageType {
    Text = 'text',
    Instruction = 'instruction',
}

export interface StreamMessage {
    content: string
    createdBy: string
    id: string
    type: MessageType
}

export enum Instruction {
    UpdateSeenAt = 'UPDATE_SEEN_AT',
}
