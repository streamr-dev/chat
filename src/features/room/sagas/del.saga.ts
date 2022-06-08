import { Provider } from '@web3-react/types'
import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { RoomAction } from '..'
import { Address } from '../../../../types/common'
import getWalletAccount from '../../../sagas/getWalletAccount.saga'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import getWalletProvider from '../../../sagas/getWalletProvider.saga'
import handleError from '../../../utils/handleError'
import preflight from '../../../utils/preflight'

function* onDeleteAction({ payload: roomId }: ReturnType<typeof RoomAction.delete>) {
    try {
        const provider: Provider = yield call(getWalletProvider)

        const account: Address = yield call(getWalletAccount)

        yield preflight({
            provider,
            address: account,
        })

        const client: StreamrClient = yield call(getWalletClient)

        yield client.deleteStream(roomId)

        yield put(RoomAction.deleteLocal(roomId))
    } catch (e) {
        handleError(e)
    }
}

export default function* del() {
    yield takeEvery(RoomAction.delete, onDeleteAction)
}
