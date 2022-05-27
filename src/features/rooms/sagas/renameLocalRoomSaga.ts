import db from '../../../utils/db'
import { RoomId } from '../types'

export default function* renameLocalRoomSaga(id: RoomId, name: string) {
    // Rename rooms for all record owners.
    yield db.rooms.where({ id }).modify({ name })
}
