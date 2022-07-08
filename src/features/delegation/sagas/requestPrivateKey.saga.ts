import { put } from 'redux-saga/effects'
import { DelegationAction } from '..'
import handleError from '$/utils/handleError'
import requestDelegatedPrivateKey from '$/utils/requestDelegatedPrivateKey'
import { error, success, info } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { WalletAction } from '$/features/wallet'
import isAuthorizedDelegatedAccount from '$/utils/isAuthorizedDelegatedAccount'
import { Wallet } from 'ethers'
import authorizeDelegatedAccount from '$/utils/authorizeDelegatedAccount'

function* onRequestPrivateKeyAction({
    payload: { owner, provider },
}: ReturnType<typeof DelegationAction.requestPrivateKey>) {
    try {
        const privateKey: string = yield requestDelegatedPrivateKey(provider, owner)

        const isDelegationAuthorized: boolean = yield isAuthorizedDelegatedAccount(
            owner,
            new Wallet(privateKey).address,
            provider
        )

        if (!isDelegationAuthorized) {
            info('Authorizing your delegated wallet')
            yield authorizeDelegatedAccount(owner, privateKey, provider)
        }

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
