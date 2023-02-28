import { put, takeLatest } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { RoomsAction } from '..'
import { Prefix } from '$/types'
import handleError from '$/utils/handleError'
import { RoomAction } from '../../room'
import { RoomId } from '../../room/types'

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

function* onFetchAction({
    payload: { requester, streamrClient },
}: ReturnType<typeof RoomsAction.fetch>) {
    try {
        const ids: RoomId[] = yield getRoomIds(streamrClient, requester)

        for (let i = 0; i < ids.length; i++) {
            yield put(
                RoomAction.fetch({
                    roomId: ids[i],
                    requester,
                    streamrClient,
                })
            )
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* fetch() {
    yield takeLatest(RoomsAction.fetch, onFetchAction)
}
