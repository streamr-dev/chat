import { RoomId } from '$/features/room/types'
import { Address, IRecord } from '$/types'
import { parseChatMessage } from '$/features/message/parser'

export interface IMessage extends IRecord {
    content?: undefined | string
    createdBy: string
    id: string
    roomId: string
    seenAt?: number
}

export type ChatMessage = ReturnType<typeof parseChatMessage>

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
