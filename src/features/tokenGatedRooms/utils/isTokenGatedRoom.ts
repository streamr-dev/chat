import { EnhancedStream } from '$/types'
import getStreamMetadata from '$/utils/getStreamMetadata'

export function isTokenGatedRoom(stream: EnhancedStream): boolean {
    return !!getStreamMetadata(stream).tokenAddress
}
