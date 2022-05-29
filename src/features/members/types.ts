import { RoomId } from '../rooms/types'

export interface MembersState {
    items: {
        [index: RoomId]: string[]
    }
}
