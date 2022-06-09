import { IRecord } from '$/types'
import { RoomId } from '../room/types'

export interface IDraft extends IRecord {
    roomId: RoomId
    content: string
}
