import { put } from 'redux-saga/effects'
import { DelegationAction } from '..'
import handleError from '$/utils/handleError'
import requestDelegatedPrivateKey from '$/utils/requestDelegatedPrivateKey'
import { error, success } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { WalletAction } from '$/features/wallet'

function* onRequestPrivateKeyAction({
    payload: { owner, provider },
}: ReturnType<typeof DelegationAction.requestPrivateKey>) {
    try {
        const privateKey: string = yield requestDelegatedPrivateKey(provider, owner)

        yield put(DelegationAction.setPrivateKey(privateKey))

        if (privateKey) {
            success('Access delegated successfully.')
        }
    } catch (e) {
        handleError(e)

        error('Failed to delegate access.')
    }
}

export default function* requestPrivateKey() {
    yield takeEveryUnique(DelegationAction.requestPrivateKey, onRequestPrivateKeyAction, {
        cancellationPattern: WalletAction.setAccount,
    })
}
