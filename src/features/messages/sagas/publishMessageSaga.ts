import { Provider } from '@web3-react/types'
import { call, select, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address } from '../../../../types/common'
import MissingDelegatedClientError from '../../../errors/MissingDelegatedClientError'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import handleError from '../../../utils/handleError'
import requestDelegatedPrivateKeySaga from '../../delegation/sagas/requestDelegatedPrivateKeySaga'
import { selectDelegatedClient } from '../../delegation/selectors'
import { DelegationState } from '../../delegation/types'
import { publishMessage, MessageAction } from '../actions'
import getWalletProviderSaga from '../../wallet/sagas/getWalletProviderSaga'
import { v4 as uuidv4 } from 'uuid'

function* getDelegatedClientSaga() {
    let client: DelegationState['client'] = yield select(selectDelegatedClient)

    if (!client) {
        const provider: Provider = yield call(getWalletProviderSaga)

        const address: Address = yield call(getWalletAccountSaga)

        yield call(requestDelegatedPrivateKeySaga, {
            provider,
            address,
        })

        client = yield select(selectDelegatedClient)

        if (!client) {
            throw new MissingDelegatedClientError()
        }
    }

    return client
}

function* onPublishMessageAction({
    payload: { roomId, content, type },
}: ReturnType<typeof publishMessage>) {
    try {
        const client: StreamrClient = yield call(getDelegatedClientSaga)

        const createdBy: Address = yield call(getWalletAccountSaga)

        yield client.publish(roomId, {
            id: uuidv4(),
            content,
            createdBy,
            type,
        })
    } catch (e) {
        handleError(e)
    }
}

export default function* publishMessageSaga() {
    yield takeEvery(MessageAction.PublishMessage, onPublishMessageAction)
}
