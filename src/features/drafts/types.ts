import { IRecord } from '../../../types/common'
import { RoomId } from '../rooms/types'

export interface IDraft extends IRecord {
    roomId: RoomId
    content: string
}
