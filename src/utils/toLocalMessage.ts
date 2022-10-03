import { IMessage, StreamMessage } from '$/features/message/types'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'

export default function toLocalMessage(
    message: StreamrMessage<StreamMessage>
): Omit<IMessage, 'owner'> {
    const { content } = message.getParsedContent()

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
