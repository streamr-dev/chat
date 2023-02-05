import { IMessage, StreamMessage } from '$/features/message/types'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'

export default function toLocalMessage(
    message: StreamrMessage<StreamMessage>
): Omit<IMessage, 'owner'> {
    const {
        messageId: {
            msgChainId,
            publisherId: createdBy,
            sequenceNumber,
            streamPartition,
            timestamp: createdAt,
            streamId: roomId,
        },
        serializedContent,
    } = message

    let content: undefined | string

    try {
        const parsed = message.getParsedContent()

        if (typeof parsed !== 'string') {
            content = parsed.content
        }
    } catch (e) {
        // Still encrypted.
    }

    const id = `${createdAt}/${streamPartition}/${sequenceNumber}/${msgChainId}`

    return {
        createdAt,
        createdBy,
        content,
        serializedContent,
        updatedAt: createdAt,
        id,
        roomId,
    }
}
