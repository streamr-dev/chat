import { Task } from 'redux-saga'
import { cancel, cancelled, delay, fork, put, retry, call, take } from 'redux-saga/effects'
import StreamrClient, { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import { Address } from '../../../../types/common'
import RoomNotFoundError from '../../../errors/RoomNotFoundError'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import getStream from '../../../utils/getStream'
import handleError from '../../../utils/handleError'
import { info } from '../../../utils/toaster'
import { RoomId } from '../types'

interface Cache {
    [roomId: RoomId]: {
        [address: Address]: Task
    }
}

export default function* registerInvite() {
    yield fork(function* () {
        const cache: Cache = {}

        while (true) {
            const {
                payload: { roomId, address: addr },
            }: ReturnType<typeof RoomAction.registerInvite> = yield take(RoomAction.registerInvite)

            const address = addr.toLowerCase()

            if (!cache[roomId]) {
                cache[roomId] = {}
            }

            if (typeof cache[roomId][address] !== 'undefined') {
                // Cancel previous fork. It's a noop if the thing finished.
                yield cancel(cache[roomId][address])
            }

            cache[roomId][address] = yield fork(function* () {
                try {
                    // This delay will get any immediate consecutive parameter-matching dispatch of
                    // the `fetch` action cancelled.
                    yield delay(1000)

                    const client: StreamrClient = yield call(getWalletClient)

                    // Invite detector tends to trigger the invitation event prematurely. In other
                    // words, at times we've gotta wait a couple of seconds for `GRANT` permission
                    // to be fully established and propagated. 30s+ usually does it.
                    yield retry(10, 3000, function* () {
                        const stream: undefined | Stream = yield getStream(client, roomId)

                        if (!stream) {
                            throw new RoomNotFoundError(roomId)
                        }

                        const hasPermission: boolean = yield stream.hasPermission({
                            user: address,
                            permission: StreamPermission.GRANT,
                            allowPublic: false,
                        })

                        if (!hasPermission) {
                            throw new Error('`GRANT` permission could not be found')
                        }
                    })

                    info("You've got an invite. Room list will reflect it shortly.")

                    yield put(
                        RoomAction.fetch({
                            roomId,
                            address,
                        })
                    )
                } catch (e) {
                    handleError(e)
                } finally {
                    if ((yield cancelled()) as boolean) {
                        console.log('registerInvite cancelled')
                    }
                }
            })
        }
    })
}
