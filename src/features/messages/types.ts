import { IRecord } from '../../../types/common'

export interface IMessage extends IRecord {
    content: string
    createdBy: string
    id: string
    roomId: string
}

export enum MessageType {
    Text = 'text',
    Metadata = 'metadata',
}

export interface StreamMessage {
    content: string
    createdBy: string
    id: string
    type: MessageType
}
