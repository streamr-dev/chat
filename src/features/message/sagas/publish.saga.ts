import { call, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address } from '$/types'
import getDelegatedClient from '$/sagas/getDelegatedClient.saga'
import handleError from '$/utils/handleError'
import { v4 as uuidv4 } from 'uuid'
import { MessageAction } from '..'
import getWalletAccount from '$/sagas/getWalletAccount.saga'

export default function* publish() {
    yield takeEvery(
        MessageAction.publish,
        function* ({
            payload: { roomId, content, type },
        }: ReturnType<typeof MessageAction.publish>) {
            try {
                const client: StreamrClient = yield call(getDelegatedClient)

                const createdBy: Address = yield call(getWalletAccount)

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
    )
}
