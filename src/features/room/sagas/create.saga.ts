import db from '../../../utils/db'
import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient, {
    Stream,
    StreamPermission,
    StreamProperties,
    STREAMR_STORAGE_NODE_GERMANY,
} from 'streamr-client'
import handleError from '../../../utils/handleError'
import preflight from '../../../utils/preflight'
import { Provider } from '@web3-react/types'
import { Address, PrivacySetting } from '../../../../types/common'
import { error, success } from '../../../utils/toaster'
import { IRoom } from '../types'
import { RoomAction } from '..'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import getWalletAccount from '../../../sagas/getWalletAccount.saga'
import getWalletProvider from '../../../sagas/getWalletProvider.saga'

function* onCreateAction({ payload: { owner, ...payload } }: ReturnType<typeof RoomAction.create>) {
    try {
        const provider: Provider = yield call(getWalletProvider)

        const account: Address = yield call(getWalletAccount)

        yield preflight({
            provider,
            address: account,
        })

        const client: StreamrClient = yield call(getWalletClient)

        // `payload.id` is a partial room id. The real room id gets constructed by the
        // client from the given value and the account address that creates the stream.

        const { id, name: description, ...metadata }: Omit<IRoom, 'owner'> = payload

        const stream: Stream = yield client.createStream({
            id,
            description,
            extensions: {
                'thechat.eth': metadata,
            },
        } as StreamProperties)

        if (payload.privacy === PrivacySetting.Public) {
            try {
                yield stream.grantPermissions({
                    public: true,
                    permissions: [StreamPermission.SUBSCRIBE],
                })

                // We don't bother the user with an extra "we made your room public"
                // toast. That'd be too much.
            } catch (e) {
                error(`Failed to make "${payload.name}" public.`)
            }
        }

        yield db.rooms.add({
            ...payload,
            id: stream.id,
            owner: owner.toLowerCase(),
        })

        success(`Stream "${payload.name}" created.`)

        // Select newly created room.
        yield put(RoomAction.select(stream.id))

        if (payload.useStorage) {
            yield put(
                RoomAction.toggleStorageNode({
                    roomId: stream.id,
                    address: STREAMR_STORAGE_NODE_GERMANY,
                    state: true,
                })
            )
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* create() {
    yield takeEvery(RoomAction.create, onCreateAction)
}
