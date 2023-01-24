import { EnhancedStream } from '$/types'
import getStreamMetadata from '$/utils/getStreamMetadata'

export function isTokenGatedRoom(stream: EnhancedStream): boolean {
    const metadata = getStreamMetadata(stream)
    return !!metadata.tokenAddress && !metadata.stakingEnabled
}
