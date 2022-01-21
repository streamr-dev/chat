import { Fragment, useCallback, useEffect, useRef } from 'react'
import MessageInterceptor from './MessageInterceptor'
import { ActionType, useDispatch, useStore } from '../../Store'
import { Partition } from '../../../utils/types'

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

type Message = any

type RoomId = string

type Cache = {
    [index: RoomId]: Message[]
}

type Props = {
    children?: React.ReactNode
}

export default function MessageAggregator({ children }: Props) {
    const { roomIds = [], roomId } = useStore()

    const dispatch = useDispatch()

    const cacheRef = useRef<Cache>({})

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

    const onMessage = useCallback(
        (data, raw) => {
            if (raw.streamPartition === Partition.Metadata) {
                // TODO
                return
            }

            if (!isMessagePayloadValid(data)) {
                console.info('Filtering out garbage')
                return
            }

            const { streamId } = raw.messageId

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

    return (
        <>
            {roomIds.map((id) => (
                <Fragment key={id}>
                    <MessageInterceptor
                        streamId={id}
                        streamPartition={Partition.Messages}
                        onMessage={onMessage}
                    />
                    <MessageInterceptor
                        streamId={id}
                        streamPartition={Partition.Metadata}
                        onMessage={onMessage}
                    />
                </Fragment>
            ))}
            {children}
        </>
    )
}
