import { ChatRoomManager } from '../src/lib/ChatRoom'
import { StreamrClient } from "streamr-client"

describe('ChatRoom', () => {
    const senderPrivateKey = '0x435fe42bde8b4040646e37040a4f945a3233d7ede63d472d3ca46d3020ffb7a3'
    const receiverPrivateKey = '0xc0f76a931c4b42fa44ec3af1d2410b032fca23658c44b976299175ac2be15d96'
    let streamId: string
    const ROOM_NAME = Date.now().toString()
    const senderClient = new StreamrClient({
        auth: {
            privateKey: senderPrivateKey
        }
    })

    const receiverClient = new StreamrClient({
        auth: {
            privateKey: receiverPrivateKey
        }
    })

    const senderManager = new ChatRoomManager(senderClient)
    const receiverManager = new ChatRoomManager(receiverClient)        

    it('should create a room, happy-path', async () => {
        const room = await senderManager.createRoom(ROOM_NAME)
        expect(room.stream).not.toBeUndefined()
        streamId = room.stream.id
    })

    it ('should throw when attempting to create a locally-existent roomId', async () => {
        const timestamp = Date.now().toString()

        try {
            await senderManager.createRoom(timestamp)
            await senderManager.createRoom(timestamp)
        } catch (e: any){
            expect(e.message).toBe(`Room [${timestamp}](0x9374effd895610e89adbc17b632423ec254f351a/streamr-chat/room/${timestamp}) already exists`)
        }
    })

    it ('should get a single room', async () => {
        const room = await senderManager.getRoom(ROOM_NAME)
        expect(room.stream.id).toBe(streamId)
    })

    it('should get all rooms', async () => {
        const rooms = await senderManager.getRooms()
        expect(rooms.length).toBeGreaterThan(0)
    })

    it('should send an invitation', async () => {
        await senderManager.sendInvitation(
            streamId, 
            await receiverClient.getAddress()
        )
    })

    it ('should get the previously created invitation', async () => {
        const invites = await receiverManager.getInvitations()
        expect(invites.length).toBeGreaterThan(0)

    })

    it ('should exercise publishMessage', async () => {
        const res = await senderManager.publishMessage(streamId, 'Hello World')
        expect(res.serializedContent).toBe('{"type":"text","payload":"Hello World"}')
    })

    it ('should exercise publishMetadata', async () => {
        const res = await senderManager.publishMetadata(streamId, { foo: 'bar' })
        expect(res.serializedContent).toBe('{"type":"metadata","payload":{"foo":"bar"}}')
    })

    it ('should exercise subscribeMessages & publishMessage', (done) => {
        receiverManager.subscribeMessages(streamId, (message) => {
            expect(message.payload).toBe('Hello World')
            done()
        })

        senderManager.publishMessage(streamId, 'Hello World')
    }, 15 * 1000)

    it ('should exercise subscribeMetadata & publishMetadata', (done) => {
        receiverManager.subscribeMetadata(streamId, (message) => {
            expect(message.payload.foo).toBe('bar')
            done()
        })
        senderManager.publishMetadata(streamId, { foo: 'bar' })
    }, 15 * 1000)

    describe('Encryption', () => {
        let streamId: string
        it ('should create an encrypted room', async () => {
            const room = await senderManager.createRoom(ROOM_NAME, true)
            streamId = room.stream.id
            expect(room.stream.id.includes('/room/encrypted/')).toBe(true)
        })

        it ('should exercise the publishMessage method for encrypted rooms', async () => {
            const res = await senderManager.publishMessage(streamId, 'Hello Encryption')
            expect(res.serializedContent.length).toBe(120)
        })

        it('should send an invitation to encrypted stream', async () => {
            await senderManager.sendInvitation(
                streamId, 
                await receiverClient.getAddress()
            )
        })

        it ('should receive properly decrypted messages on encrypted room', (done) => {
            receiverManager.subscribeMessages(streamId, (message) => {
                expect(message.payload).toBe('Hello Encryption')
                done()
            })
            senderManager.publishMessage(streamId, 'Hello Encryption').then((sent) => {
                return expect(sent.serializedContent.length).toBe(120)
            }).catch((e) => {
                throw e
            })
        })
    })

})

