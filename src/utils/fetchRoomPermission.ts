import StreamrClient, { Stream, StreamPermission } from 'streamr-client'
import { Address } from '../../types/common'
import RoomNotFoundError from '../errors/RoomNotFoundError'
import { RoomId } from '../features/rooms/types'
import getStream from './getStream'

interface Params {
    roomId: RoomId
    address: Address
    permission: StreamPermission
    client: StreamrClient
}

export default async function fetchRoomPermission({ address, client, permission, roomId }: Params) {
    const stream: undefined | Stream = await getStream(client, roomId)

    if (!stream) {
        throw new RoomNotFoundError(roomId)
    }

    const hasPermission: boolean = await stream.hasPermission({
        user: address,
        permission,
        allowPublic: true,
    })

    return hasPermission
}
