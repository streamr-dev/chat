import { EnhancedStream } from '$/types'

export function isTokenGatedRoom(stream: EnhancedStream): boolean {
    const { tokenAddress } = stream.extensions['thechat.eth']
    return tokenAddress !== undefined
}
