import { Fragment, useCallback, useEffect, useRef } from 'react'
import MessageInterceptor from './MessageInterceptor'
import { ActionType, useDispatch, useStore } from '../../Store'
import { MessagePayload, MessageType, MetadataType } from '../../../utils/types'
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

type Cache = MessagePayload[]

export type PresenceCache = {
    [address: string]: number
}

type Props = {
    children?: React.ReactNode
}

export default function MessageAggregator({ children }: Props) {
    const { roomIds = [], roomId, account } = useStore()

    const dispatch = useDispatch()

    const cacheRef = useRef<Cache>([])

    const deleteRoom = useDeleteRoom()

    useEffect(() => {
        ;(async () => {
            if (!roomId) {
                return
            }

            cacheRef.current = await getLocalMessagesForRoom(roomId)

            dispatch({
                type: ActionType.SetMessages,
                payload: cacheRef.current || [],
            })
        })()
    }, [dispatch, roomId])

    const onTextMessage = useCallback(            
        (data: MessagePayload, { messageId }: any) => {
            const { streamId, streamPartition } = messageId

            if (data.type !== MessageType.Text) {
                throw new Error('Unexpected message type')
            }

            if (!isMessagePayloadValid(data)) {
                console.warn('Filtering out garbage')
                return
            }

            const { current: cache } = cacheRef

            cache.push(data)

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
                    payload: cache,
                })
            }
        },
        [dispatch, roomId]
    )

    const onMetadataMessage = useCallback(
            
        (data: MessagePayload, { messageId }: any) => {
            const { streamPartition } = messageId
            const body = data.body as any
            

            if (data.type !== MessageType.Metadata) {
                throw new Error('Unexpected message type')
            }
            switch (body.type) {
                
                case MetadataType.SendInvite:
                    console.info('sent invite to', body.payload)
                    break
                case MetadataType.AcceptInvite:
                    console.info('accepted invite', data)
                    break
                case MetadataType.RevokeInvite:
                    console.info('revoked invite', data)

                    const target = body.payload
                    if (target === account) {
                        deleteRoom(target)
                    }
                    break
                default:
                    console.warn('Unknown metadata type', data)
                    break
            }
        },
        [account, deleteRoom]
    )

    return (
        <>
            {roomIds.map((id) => (
                <Fragment key={id}>
                    <MessageInterceptor
                        streamId={id}
                        onTextMessage={onTextMessage}
                        onMetadataMessage={onMetadataMessage}
                    />
                </Fragment>
            ))}
            {children}
        </>
    )
}
