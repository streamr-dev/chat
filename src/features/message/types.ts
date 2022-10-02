import { RoomId } from '$/features/room/types'
import { Address, IRecord } from '$/types'

export interface IMessage extends IRecord {
    content?: undefined | string
    serializedContent: string
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
    beginningOfDay: number
    timezoneOffset: number
}

export interface MessageState {
    [owner: Address]: {
        [roomId: RoomId]: {
            from: undefined | number
        }
    }
}
