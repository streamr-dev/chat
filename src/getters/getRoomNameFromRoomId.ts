import { shake256 } from 'js-sha3'
import { RoomId } from '../utils/types'
import {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
    names,
} from 'unique-names-generator'

export default function getRoomNameFromRoomId(streamId: RoomId): string {
    const stringSeed = shake256(streamId, 64)

    const seed = parseInt(stringSeed, 16)

    return uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals, names],
        separator: '-',
        length: 3,
        seed,
    })
}
