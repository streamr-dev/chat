import {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
} from 'unique-names-generator'

export default function getRandomRoomName(): string {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: '-',
        length: 3,
    })
}
