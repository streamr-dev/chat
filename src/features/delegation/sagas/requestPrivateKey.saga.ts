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
    let succeeded = false

    try {
        const privateKey: string = yield requestDelegatedPrivateKey(provider, owner)

        yield put(DelegationAction.setPrivateKey(privateKey))

        succeeded = true
    } catch (e) {
        handleError(e)
    }

    // It's purposely outside of `finally`. Saga cancelled? No toasts for you.
    if (succeeded) {
        success('Access delegated successfully.')
    } else {
        error('Failed to delegate access.')
    }
}

export default function* requestPrivateKey() {
    yield takeEveryUnique(DelegationAction.requestPrivateKey, onRequestPrivateKeyAction, {
        cancellationPattern: WalletAction.setAccount,
    })
}
