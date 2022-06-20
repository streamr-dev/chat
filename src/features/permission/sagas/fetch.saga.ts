import { put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import handleError from '$/utils/handleError'
import { PermissionAction } from '..'
import getStream from '$/utils/getStream'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import takeEveryUnique from '$/utils/takeEveryUnique'

function* onFetchAction({
    payload: { roomId, address, permission, streamrClient },
}: ReturnType<typeof PermissionAction.fetch>) {
    try {
        const stream: undefined | Stream = yield getStream(streamrClient, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const value: boolean = yield stream.hasPermission({
            user: address,
            permission,
            allowPublic: true,
        })

        yield put(
            PermissionAction.setLocal({ roomId, address, permissions: { [permission]: value } })
        )
    } catch (e) {
        handleError(e)
    }
}

export default function* fetch() {
    // @TODO skip fetching individual if bulk is in progress.
    yield takeEveryUnique(PermissionAction.fetch, onFetchAction)
}
