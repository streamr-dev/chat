import { Provider } from '@web3-react/types'
import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address, EnhancedStream } from '../../../../types/common'
import RoomNotFoundError from '../../../errors/RoomNotFoundError'
import getStream from '../../../utils/getStream'
import preflight from '../../../utils/preflight'
import { RoomAction } from '..'
import handleError from '../../../utils/handleError'
import getWalletProvider from '../../../sagas/getWalletProvider.saga'
import getWalletAccount from '../../../sagas/getWalletAccount.saga'
import getWalletClient from '../../../sagas/getWalletClient.saga'

function* onRenameAction({ payload: { roomId, name } }: ReturnType<typeof RoomAction.rename>) {
    try {
        const provider: Provider = yield call(getWalletProvider)

        const address: Address = yield call(getWalletAccount)

        yield preflight({
            provider,
            address,
        })

        const client: StreamrClient = yield call(getWalletClient)

        const stream: undefined | EnhancedStream = yield getStream(client, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        stream.description = name

        stream.extensions['thechat.eth'].updatedAt = Date.now()

        yield stream.update()

        yield put(
            RoomAction.renameLocal({
                roomId,
                name,
            })
        )
    } catch (e) {
        handleError(e)
    }
}

export default function* rename() {
    yield takeEvery(RoomAction.rename, onRenameAction)
}
