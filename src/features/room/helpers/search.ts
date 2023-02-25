import { RoomAction } from '$/features/room'
import fetchStream from '$/utils/fetchStream'
import getRoomMetadata from '$/utils/getRoomMetadata'
import handleError from '$/utils/handleError'
import { call, put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'

export default function search({
    roomId,
    streamrClient,
}: ReturnType<typeof RoomAction.search>['payload']) {
    return call(function* () {
        try {
            const stream: Stream | null = yield fetchStream(roomId, streamrClient)

            if (!stream) {
                yield put(
                    RoomAction.cacheSearchResult({
                        roomId,
                        metadata: null,
                    })
                )

                return
            }

            const { tokenAddress, name = '' } = getRoomMetadata(stream)

            yield put(
                RoomAction.cacheSearchResult({
                    roomId,
                    metadata: {
                        name,
                        tokenAddress,
                    },
                })
            )
        } catch (e) {
            handleError(e)
        }
    })
}
