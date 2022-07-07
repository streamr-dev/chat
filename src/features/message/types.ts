import { IRecord } from '$/types'

export interface IMessage extends IRecord {
    content: string
    createdBy: string
    id: string
    roomId: string
    seenAt?: number
}

export interface StreamMessage {
    content: string
    createdBy: string
    id: string
}
