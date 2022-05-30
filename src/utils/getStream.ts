import StreamrClient from 'streamr-client'
import { EnhancedStream } from '../../types/common'
import sanitizeStream from './sanitizeStream'

export default async function getStream(
    client: StreamrClient,
    id: string
): Promise<undefined | EnhancedStream> {
    const stream = await client.getStream(id)

    return stream ? sanitizeStream(stream) : undefined
}
