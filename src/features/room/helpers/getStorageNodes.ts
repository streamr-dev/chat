import { call, put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import { RoomAction } from '..'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import handleError from '$/utils/handleError'
import fetchStream from '$/utils/fetchStream'

export default function getStorageNodes({
    roomId,
}: ReturnType<typeof RoomAction.getStorageNodes>['payload']) {
    return call(function* () {
        try {
            const stream: Stream | null = yield fetchStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const storageNodes: string[] = yield stream.getStorageNodes()

            yield put(
                RoomAction.setLocalStorageNodes({
                    roomId,
                    addresses: storageNodes,
                })
            )
        } catch (e) {
            handleError(e)
        }
    })
}
