import { RoomId } from '$/features/room/types'
import { Address, IRecord } from '$/types'

export interface IPreference extends IRecord {
    showHiddenRooms?: boolean
    selectedRoomId?: RoomId
}

export interface PreferencesState {
    ongoingSetting: {
        [owner: Address]: boolean
    }
}
