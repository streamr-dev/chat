import { StreamrClient, Stream, StreamOperation } from 'streamr-client'

export interface ChatMessage {
    type: 'text' | 'metadata'
    payload: string
}

export interface ChatRoom {
    name: string
    stream: Stream
    publishMessage: (message: string) => Promise<void>
    publishMetadata: (metadata: any) => Promise<void>
    subscribeMessages: (callback: (message: ChatMessage) => void) => void
    subscribeMetadata: (callback: (metadata: any) => void) => void
}

export class ChatRoomManager {
    client: StreamrClient

    readonly ROOM_PREFIX: string = 'streamr-chat/room'
    readonly STREAM_PARTITION_MESSAGES = 0
    readonly STREAM_PARTITION_METADATA = 1

    private rooms: { [roomId: string]: ChatRoom } = {}

    constructor(client: StreamrClient) {
        this.client = client
    }

    private async getStreamIdFromRoomName(
        roomName: string,
        requireEncryptedData = false
    ): Promise<string> {
        const encryptionPrefix = requireEncryptedData ? 'encrypted/' : ''
        return `${await this.client.getAddress()}/${
            this.ROOM_PREFIX
        }/${encryptionPrefix}${roomName}`.toLowerCase()
    }

    private getRoomNameFromStreamId(streamId: string): string {
        return streamId.substring(streamId.lastIndexOf('/') + 1)
    }

    private async generateChatRoom(
        streamId: string,
        stream?: Stream
    ): Promise<ChatRoom> {
        return {
            name: this.getRoomNameFromStreamId(streamId),
            stream: stream || (await this.client.getStream(streamId)),
            publishMessage: (message: string) =>
                this.publishMessage(streamId, message),
            publishMetadata: (metadata: any) =>
                this.publishMetadata(streamId, metadata),
            subscribeMessages: (callback: (message: ChatMessage) => void) =>
                this.subscribeMessages(streamId, callback),
            subscribeMetadata: (callback: (metadata: any) => void) =>
                this.subscribeMetadata(streamId, callback),
        } as ChatRoom
    }

    public async createRoom(
        roomName: string,
        requireEncryptedData = false
    ): Promise<ChatRoom> {
        const streamId = await this.getStreamIdFromRoomName(
            roomName,
            requireEncryptedData
        )
        if (this.rooms[streamId]) {
            throw new Error(`Room [${roomName}](${streamId}) already exists`)
        }

        const stream = await this.client.createStream({
            id: streamId,
            partitions: 2,
            requireEncryptedData,
        })

        this.rooms[streamId] = await this.generateChatRoom(streamId, stream)
        return this.rooms[streamId]
    }

    public async getRoom(roomName: string): Promise<ChatRoom> {
        const streamId = await this.getStreamIdFromRoomName(roomName)
        if (!this.rooms[streamId]) {
            const room = await this.createRoom(roomName)
            this.rooms[streamId] = room
        }
        return this.rooms[streamId]
    }

    public async getRooms(): Promise<Array<string>> {
        const roomStreams = await this.client.listStreams()
        const filtered = roomStreams.filter((stream: Stream) =>
            stream.id.includes(this.ROOM_PREFIX)
        )
        return filtered.map((stream: Stream) =>
            this.getRoomNameFromStreamId(stream.id)
        )
    }

    public async sendInvitation(
        streamId: string,
        recipient: string
    ): Promise<void> {
        const stream = await this.client.getStream(streamId)
        await stream.grantPermissions(
            [
                StreamOperation.STREAM_PUBLISH,
                StreamOperation.STREAM_SUBSCRIBE,
                StreamOperation.STREAM_SHARE,
            ],
            recipient
        )
    }

    public async getInvitations(): Promise<Array<Stream>> {
        const streams = await this.client.listStreams({
            operation: StreamOperation.STREAM_SHARE,
        })

        const address = await this.client.getAddress()
        const invitations: Array<Stream> = []
        for (let i = 0; i < streams.length; i++) {
            const stream = streams[i]
            if (
                !stream.id.includes(address) &&
                stream.id.includes(this.ROOM_PREFIX)
            ) {
                invitations.push(stream)
            }
        }
        return streams
    }

    public async publishMessage(
        streamId: string,
        message: string
    ): Promise<any> {
        return this.client.publish(
            streamId,
            {
                type: 'text',
                payload: message,
            },
            Date.now(),
            this.STREAM_PARTITION_MESSAGES
        )
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public async publishMetadata(
        streamId: string,
        metadata: any
    ): Promise<any> {
        return this.client.publish(
            streamId,
            {
                type: 'metadata',
                payload: metadata,
            } as ChatMessage,
            Date.now(),
            this.STREAM_PARTITION_METADATA
        )
    }

    public async subscribeMessages(
        streamId: string,
        callback: (message: ChatMessage) => void
    ): Promise<void> {
        this.client.subscribe(
            {
                streamId,
                streamPartition: this.STREAM_PARTITION_MESSAGES,
            },
            (message: any) => {
                //callback(JSON.parse(message))
                callback(message)
            }
        )
    }

    public async subscribeMetadata(
        streamId: string,
        callback: (metadata: any) => void
    ): Promise<void> {
        this.client.subscribe(
            {
                streamId,
                streamPartition: this.STREAM_PARTITION_METADATA,
            },
            (message: any) => {
                callback(message)
            }
        )
    }
}
