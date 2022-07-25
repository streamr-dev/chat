import { put } from 'redux-saga/effects'
import { DelegationAction } from '..'
import handleError from '$/utils/handleError'
import requestDelegatedPrivateKey from '$/utils/requestDelegatedPrivateKey'
import { error, success } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { WalletAction } from '$/features/wallet'
import isAuthorizedDelegatedAccount from '$/utils/isAuthorizedDelegatedAccount'
import { Wallet } from 'ethers'
import authorizeDelegatedAccount from '$/utils/authorizeDelegatedAccount'
import { toast } from 'react-toastify'

function* onRequestPrivateKeyAction({
    payload: { owner, provider },
}: ReturnType<typeof DelegationAction.requestPrivateKey>) {
    let toastId

    try {
        const privateKey: string = yield requestDelegatedPrivateKey(provider, owner)

        const isDelegationAuthorized: boolean = yield isAuthorizedDelegatedAccount(
            owner,
            new Wallet(privateKey).address,
            provider
        )

        if (!isDelegationAuthorized) {
            toastId = toast.loading('Authorizing your delegated wallet...', {
                position: 'bottom-left',
                autoClose: false,
                type: 'info',
                closeOnClick: false,
                hideProgressBar: true,
            })
            yield authorizeDelegatedAccount(owner, privateKey, provider)
        }

        yield put(DelegationAction.setPrivateKey(privateKey))

        if (privateKey) {
            success('Access delegated successfully.')
        }
    } catch (e) {
        handleError(e)
        error('Failed to delegate access.')
    } finally {
        if (toastId) {
            toast.dismiss(toastId)
        }
    }
}

export default function* requestPrivateKey() {
    yield takeEveryUnique(DelegationAction.requestPrivateKey, onRequestPrivateKeyAction, {
        cancellationPattern: WalletAction.setAccount,
    })
}
