import { Fragment, useCallback, useEffect, useRef } from 'react'
import MessageInterceptor from './MessageInterceptor'
import { ActionType, useDispatch, useStore } from '../../Store'
import { MessagePayload, Partition, RoomId } from '../../../utils/types'
import useDeleteRoom from '../../../hooks/useDeleteRoom'
import { db } from '../../../utils/db'
import getLocalMessagesForRoom from '../../../getters/getLocalMessagesForRoom'

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

export type PresenceCache = {
    [address: string]: number
}

type Props = {
    children?: React.ReactNode
}

export enum MetadataType {
    UserOnline = 'user-online',
    SendInvite = 'send-invite',
    AcceptInvite = 'accept-invite',
    RevokeInvite = 'revoke-invite',
}

export default function MessageAggregator({ children }: Props) {
    const { roomIds = [], roomId, account } = useStore()

    const dispatch = useDispatch()

    const cacheRef = useRef<Cache>({})
    const presenceCacheRef = useRef<PresenceCache>({})

    const deleteRoom = useDeleteRoom()

    useEffect(() => {
        const { current: cache } = cacheRef

        ;(async () => {
            if (!roomId) {
                return
            }

            cache[roomId] = await getLocalMessagesForRoom(roomId)

            dispatch({
                type: ActionType.SetMessages,
                payload: cache[roomId] || [],
            })
        })()
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

            db.messages.add({
                roomId: streamId,
                serialized: JSON.stringify(data),
            })

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

    const onMetadataMessage = useCallback(
        (data, { messageId }) => {
            const { streamPartition } = messageId

            if (streamPartition !== Partition.Metadata) {
                throw new Error('Unexpected partition')
            }
            const { current: cache } = presenceCacheRef
            switch (data.body.type) {
                case MetadataType.UserOnline:
                    if (
                        cache[data.sender] &&
                        cache[data.sender] + 60 * 1000 > Date.now()
                    ) {
                        return
                    }
                    cache[data.sender] = data.createdAt

                    break
                case MetadataType.SendInvite:
                    console.info('sent invite to', data.body.payload)
                    break
                case MetadataType.AcceptInvite:
                    console.info('accepted invite', data)
                    break
                case MetadataType.RevokeInvite:
                    console.info('revoked invite', data)

                    const target = data.body.payload
                    if (target === account) {
                        deleteRoom(target)
                    }
                    break
                default:
                    console.warn('Unknown metadata type', data)
                    break
            }

            console.info('Cache updated', cache)
        },
        [account, deleteRoom]
    )

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
