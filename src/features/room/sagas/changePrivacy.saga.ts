import { Provider } from '@web3-react/types'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient, { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import { Address, PrivacySetting } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import getWalletAccount from '$/sagas/getWalletAccount.saga'
import getWalletClient from '$/sagas/getWalletClient.saga'
import getWalletProvider from '$/sagas/getWalletProvider.saga'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { error, success } from '$/utils/toaster'
import { selectPrivacyChanging } from '../selectors'

function* onChangePrivacyAction({
    payload: { roomId, privacy },
}: ReturnType<typeof RoomAction.changePrivacy>) {
    let dirty = false

    try {
        const changing: boolean = yield select(selectPrivacyChanging(roomId))

        if (changing) {
            // Already changing. Skipping.
            return
        }

        const provider: Provider = yield call(getWalletProvider)

        const account: Address = yield call(getWalletAccount)

        yield preflight({
            provider,
            requester: account,
        })

        yield put(
            RoomAction.setChangingPrivacy({
                roomId,
                state: true,
            })
        )

        dirty = true

        const client: StreamrClient = yield call(getWalletClient)

        const stream: undefined | Stream = yield getStream(client, roomId)

        const permissions: StreamPermission[] =
            privacy === PrivacySetting.Public ? [StreamPermission.SUBSCRIBE] : []

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const { description: name = 'Unnamed room' } = stream

        try {
            yield client.setPermissions({
                streamId: roomId,
                assignments: [
                    {
                        public: true,
                        permissions,
                    },
                ],
            })

            yield put(
                RoomAction.setLocalPrivacy({
                    roomId,
                    privacy,
                })
            )

            success(`Update privacy for "${name}".`)
        } catch (e) {
            console.warn(e)
            error(`Failed to update privacy for "${name}".`)
        }
    } catch (e) {
        handleError(e)
    } finally {
        if (dirty) {
            yield put(
                RoomAction.setChangingPrivacy({
                    roomId,
                    state: false,
                })
            )
        }
    }
}

export default function* changePrivacy() {
    yield takeEvery(RoomAction.changePrivacy, onChangePrivacyAction)
}
