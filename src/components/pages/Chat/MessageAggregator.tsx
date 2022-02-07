import { Fragment, useCallback, useEffect, useRef } from 'react'
import MessageInterceptor from './MessageInterceptor'
import { ActionType, useDispatch, useStore } from '../../Store'
import { MessagePayload, Partition, RoomId } from '../../../utils/types'

function isMessagePayloadValid(data: any) {
    function hasPayloadField(fieldName: string) {
        return Object.prototype.hasOwnProperty.call(data, fieldName)
    }

    return (
        typeof data === 'object' &&
        hasPayloadField('id') &&
        typeof data.id === 'string' &&
        hasPayloadField('body') &&
        typeof data.body === 'string' &&
        hasPayloadField('version') &&
        data.version === 1 &&
        hasPayloadField('sender') &&
        typeof data.sender === 'string' &&
        hasPayloadField('createdAt') &&
        typeof data.createdAt === 'number'
    )
}

type Cache = {
    [index: RoomId]: MessagePayload[]
}

type PresenceCache = {
    [address: string]: number
}

type Props = {
    children?: React.ReactNode
}

export default function MessageAggregator({ children }: Props) {
    const { roomIds = [], roomId } = useStore()

    const dispatch = useDispatch()

    const cacheRef = useRef<Cache>({})
    const presenceCacheRef = useRef<PresenceCache>({})

    useEffect(() => {
        const { current: cache } = cacheRef

        if (!roomId) {
            return
        }

        dispatch({
            type: ActionType.SetMessages,
            payload: cache[roomId] || [],
        })
    }, [dispatch, roomId])

    const onTextMessage = useCallback(
        (data, { messageId }) => {
            const { streamId, streamPartition } = messageId

            if (streamPartition !== Partition.Messages) {
                throw new Error('Unexpected partition')
            }

            if (!isMessagePayloadValid(data)) {
                console.warn('Filtering out garbage')
                return
            }

            const { current: cache } = cacheRef

            if (!cache[streamId]) {
                cache[streamId] = []
            }

            cache[streamId].push(data)

            dispatch({
                type: ActionType.SetRecentMessage,
                payload: {
                    [streamId]: data.body,
                },
            })

            if (streamId === roomId) {
                dispatch({
                    type: ActionType.SetMessages,
                    payload: cache[streamId],
                })
            }
        },
        [dispatch, roomId]
    )

    const onMetadataMessage = useCallback((data, { messageId }) => {
        const { streamPartition } = messageId

        if (streamPartition !== Partition.Metadata) {
            throw new Error('Unexpected partition')
        }

        const { current: cache } = presenceCacheRef

        if (data.type === 'user-online') {
            cache[data.from] = data.timestamp
        }

        if (data.type === 'invite') {
            console.info('sent invite to', data.to)
        }

        if (data.type === 'accept-invite') {
            console.info('accepted invite', data)
        }

        console.info('Cache updated', cache)
    }, [])

    return (
        <>
            {roomIds.map((id) => (
                <Fragment key={id}>
                    <MessageInterceptor
                        streamId={id}
                        streamPartition={Partition.Messages}
                        onMessage={onTextMessage}
                    />
                    <MessageInterceptor
                        streamId={id}
                        streamPartition={Partition.Metadata}
                        onMessage={onMetadataMessage}
                    />
                </Fragment>
            ))}
            {children}
        </>
    )
}
