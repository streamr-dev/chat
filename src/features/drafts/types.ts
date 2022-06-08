import { IRecord } from '../../../types/common'
import { RoomId } from '../room/types'

export interface IDraft extends IRecord {
    roomId: RoomId
    content: string
}
