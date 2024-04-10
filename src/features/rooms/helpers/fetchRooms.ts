import { call, put } from 'redux-saga/effects'
import StreamrClient from '@streamr/sdk'
import { Address, Prefix } from '$/types'
import handleError from '$/utils/handleError'
import { RoomAction } from '../../room'
import { RoomId } from '../../room/types'
import getTransactionalClient from '$/utils/getTransactionalClient'

async function getRoomIds(client: StreamrClient, account: string) {
    const ids: RoomId[] = []

    const search = client.searchStreams(Prefix.Room, {
        user: account,
        allowPublic: false,
    })

    for await (const stream of search) {
        ids.push(stream.id)
    }

    return ids
}

export default function fetchRooms(requester: Address) {
    return call(function* () {
        try {
            const streamrClient: StreamrClient = yield getTransactionalClient()

            const ids: RoomId[] = yield getRoomIds(streamrClient, requester)

            for (let i = 0; i < ids.length; i++) {
                yield put(
                    RoomAction.fetch({
                        roomId: ids[i],
                        requester,
                    })
                )
            }
        } catch (e) {
            handleError(e)
        }
    })
}
