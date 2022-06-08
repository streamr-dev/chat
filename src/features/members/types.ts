import { RoomId } from '../room/types'

export interface MembersState {
    items: {
        [index: RoomId]: string[]
    }
}
