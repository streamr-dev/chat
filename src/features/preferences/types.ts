import { RoomId } from '$/features/room/types'
import { IRecord } from '$/types'

export interface IPreference extends IRecord {
    showHiddenRooms?: boolean
    selectedRoomId?: RoomId
    retrieveHotWalletImmediately?: boolean
    stickyRoomIds?: RoomId[]
}
