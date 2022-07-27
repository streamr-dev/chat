import { RoomId } from '$/features/room/types'
import { Address, IRecord } from '$/types'

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

export interface IResend {
    roomId: RoomId
    owner: Address
    beginningOfDay: number // utc + timezone offset
}
