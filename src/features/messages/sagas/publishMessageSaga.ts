import { Provider } from '@web3-react/types'
import { all, call, select, takeEvery, throttle } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address } from '../../../../types/common'
import MissingDelegatedClientError from '../../../errors/MissingDelegatedClientError'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import handleError from '../../../utils/handleError'
import requestDelegatedPrivateKeySaga from '../../delegation/sagas/requestDelegatedPrivateKeySaga'
import { selectDelegatedClient } from '../../delegation/selectors'
import { DelegationState } from '../../delegation/types'
import { publishMessage, MessageAction, emitPresence } from '../actions'
import getWalletProviderSaga from '../../wallet/sagas/getWalletProviderSaga'
import { v4 as uuidv4 } from 'uuid'
import Minute from '../../../utils/minute'
import { Instruction, MessageType } from '../types'

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

async function publish(
    client: StreamrClient,
    createdBy: Address,
    { roomId, content, type }: ReturnType<typeof publishMessage>['payload']
) {
    try {
        await client.publish(roomId, {
            id: uuidv4(),
            content,
            createdBy,
            type,
        })
    } catch (e) {
        handleError(e)
    }
}

function* onPublishMessageAction({ payload }: ReturnType<typeof publishMessage>) {
    const client: StreamrClient = yield call(getDelegatedClientSaga)

    const createdBy: Address = yield call(getWalletAccountSaga)

    yield publish(client, createdBy, payload)
}

function* onEmitPresence({ payload: roomId }: ReturnType<typeof emitPresence>) {
    const client: StreamrClient = yield call(getDelegatedClientSaga)

    const createdBy: Address = yield call(getWalletAccountSaga)

    yield publish(client, createdBy, {
        roomId,
        content: Instruction.UpdateSeenAt,
        type: MessageType.Instruction,
    })
}

export default function* publishMessageSaga() {
    yield all([
        takeEvery(MessageAction.PublishMessage, onPublishMessageAction),
        throttle(Minute / 2, MessageAction.EmitPresence, onEmitPresence),
    ])
}
