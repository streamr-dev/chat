import {
    StreamrClient,
    Stream,
    StreamOperation,
    StreamPermision,
} from 'streamr-client'
import { ChatMessage, ChatRoom, MessageType } from '../utils/types'
import {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
    names,
} from 'unique-names-generator'
import { shake256 } from 'js-sha3'

const ROOM_PREFIX: string = 'streamr-chat/room'
const LOCAL_STORAGE_KEY = 'streamr-chat-rooms'

export enum STREAM_PARTITION {
    MESSAGES,
    METADATA,
}

const publishMessage = async (
    client: StreamrClient,
    streamId: string,
    message: string
): Promise<any> => {
    return client.publish(
        streamId,
        {
            type: MessageType.TEXT,
            payload: message,
        },
        Date.now(),
        STREAM_PARTITION.MESSAGES
    )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const publishMetadata = async (
    client: StreamrClient,
    streamId: string,
    metadata: any
): Promise<any> => {
    return client.publish(
        streamId,
        {
            type: MessageType.METADATA,
            payload: metadata,
        } as ChatMessage,
        Date.now(),
        STREAM_PARTITION.METADATA
    )
}

const subscribeMessages = async (
    client: StreamrClient,
    streamId: string,
    callback: (message: ChatMessage) => void
): Promise<void> => {
    client.subscribe(
        {
            streamId,
            streamPartition: STREAM_PARTITION.MESSAGES,
        },
        (message: any) => {
            //callback(JSON.parse(message))
            callback(message)
        }
    )
}

const subscribeMetadata = async (
    client: StreamrClient,
    streamId: string,
    callback: (metadata: any) => void
): Promise<void> => {
    client.subscribe(
        {
            streamId,
            streamPartition: STREAM_PARTITION.METADATA,
        },
        (message: any) => {
            callback(message)
        }
    )
}

const getRoomNameFromStreamId = (streamId: string): string => {
    const stringSeed = shake256(streamId, 64)
    const seed = parseInt(stringSeed, 16)
    return uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals, names],
        separator: '-',
        length: 3,
        seed,
    })
}

export const generateChatRoom = async (
    client: StreamrClient,
    streamId: string,
    stream?: Stream
): Promise<ChatRoom> => {
    return {
        id: streamId,
        name: getRoomNameFromStreamId(streamId),
        stream: stream || (await client.getStream(streamId)),
        publishMessage: (message: string) =>
            publishMessage(client, streamId, message),
        publishMetadata: (metadata: any) =>
            publishMetadata(client, streamId, metadata),
        subscribeMessages: (callback: (message: ChatMessage) => void) =>
            subscribeMessages(client, streamId, callback),
        subscribeMetadata: (callback: (metadata: any) => void) =>
            subscribeMetadata(client, streamId, callback),
    }
}

const getStreamIdFromRoomName = (
    clientAddress: string,
    roomName: string,
    requireEncryptedData = false
): string => {
    const encryptionPrefix = requireEncryptedData ? 'encrypted/' : ''
    return `${clientAddress}/${ROOM_PREFIX}/${encryptionPrefix}${roomName}`.toLowerCase()
}

export const sendChatRoomInvitation = async (
    client: StreamrClient,
    streamId: string,
    recipient: string
): Promise<StreamPermision[]> => {
    const stream = await client.getStream(streamId)
    return await stream.grantPermissions(
        [
            StreamOperation.STREAM_PUBLISH,
            StreamOperation.STREAM_SUBSCRIBE,
            StreamOperation.STREAM_SHARE,
            StreamOperation.STREAM_GET,
        ],
        recipient
    )
}

const storeRoomIds = (ids: Array<string>) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids))
}

export const createRoom = async (
    client: StreamrClient,
    address: string,
    metamaskAddress: string,
    roomName: string,
    roomIds: Array<string>,
    requireEncryptedData = false
): Promise<ChatRoom> => {
    const streamId = getStreamIdFromRoomName(
        address,
        roomName,
        requireEncryptedData
    )

    console.log(streamId, client)

    const stream = await client.createStream({
        id: streamId,
        partitions: 2,
        requireEncryptedData,
    })

    await sendChatRoomInvitation(client, streamId, metamaskAddress)

    const room = await generateChatRoom(client, streamId, stream)
    roomIds.push(room.id)
    storeRoomIds(roomIds)
    return room
}
