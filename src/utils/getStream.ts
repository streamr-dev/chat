import StreamrClient from 'streamr-client'
import { EnhancedStream } from '$/types'
import sanitizeStream from './sanitizeStream'
import handleError from '$/utils/handleError'

export default async function getStream(
    client: StreamrClient,
    id: string
): Promise<undefined | EnhancedStream> {
    let stream

    try {
        stream = await client.getStream(id)
    } catch (e) {
        handleError(e)
    }

    return stream ? sanitizeStream(stream) : undefined
}
