import { parseChatMessage } from '$/features/message/parser'
import { IMessage } from '$/features/message/types'
import { StreamMessage } from '@streamr/sdk'

export default function toLocalMessage(message: StreamMessage): Omit<IMessage, 'owner'> {
    const {
        messageId: {
            msgChainId,
            publisherId: createdBy,
            sequenceNumber,
            streamPartition,
            timestamp: createdAt,
            streamId: roomId,
        },
    } = message

    let content: undefined | string

    try {
        content = parseChatMessage(message.getParsedContent()).content
    } catch (e) {
        // Still encrypted.
    }

    const id = `${createdAt}/${streamPartition}/${sequenceNumber}/${msgChainId}`

    return {
        createdAt,
        createdBy,
        content,
        updatedAt: createdAt,
        id,
        roomId,
    }
}
