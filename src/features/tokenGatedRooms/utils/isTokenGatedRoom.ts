import { EnhancedStream } from '$/types'

export function isTokenGatedRoom(stream: EnhancedStream): boolean {
    return !!stream.extensions['thechat.eth'].tokenAddress
}
