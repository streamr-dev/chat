import { call, put, takeLatest } from 'redux-saga/effects'
import StreamrClient, { Stream } from 'streamr-client'
import { Address } from '$/types'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import { RoomAction } from '..'
import getWalletClient from '$/sagas/getWalletClient.saga'
import getWalletAccount from '$/sagas/getWalletAccount.saga'
import { IRoom } from '$/features/room/types'
import db from '$/utils/db'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'

function* onSyncAction({ payload: roomId }: ReturnType<typeof RoomAction.sync>) {
    try {
        const client: StreamrClient = yield call(getWalletClient)

        const account: Address = yield call(getWalletAccount)

        const stream: undefined | Stream = yield getStream(client, roomId)

        if (stream) {
            const [permissions, isPublic]: UserPermissions = yield getUserPermissions(
                account,
                stream
            )

            let pinned = false

            if (isPublic) {
                const room: undefined | IRoom = yield db.rooms
                    .where({ owner: account?.toLowerCase() || '', id: roomId })
                    .first()

                pinned = Boolean(room?.pinned)
            }

            if (permissions.length || pinned) {
                yield put(
                    RoomAction.renameLocal({
                        roomId,
                        name: stream.description || '',
                    })
                )

                return
            }
        }

        // At this point we know that the stream isn't there, or we don't have anything to do with
        // it (no explicit permissions). Let's remove it from the navigation sidebar.

        yield put(RoomAction.deleteLocal(roomId))
    } catch (e) {
        handleError(e)
    }
}

export default function* sync() {
    yield takeLatest(RoomAction.sync, onSyncAction)
}
