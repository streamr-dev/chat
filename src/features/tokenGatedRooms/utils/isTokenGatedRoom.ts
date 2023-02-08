import type { Stream } from 'streamr-client'
import getRoomMetadata from '$/utils/getRoomMetadata'

export function isTokenGatedRoom(stream: Stream) {
    return !!getRoomMetadata(stream).tokenAddress
}
