import Toast, { ToastType } from '$/components/Toast'
import { selectDelegatedAccount } from '$/features/delegation/selectors'
import toaster from '$/features/toaster/helpers/toaster'
import { Address, OptionalAddress } from '$/types'
import { call, put, select } from 'redux-saga/effects'
import { Controller as ToastController } from '$/components/Toaster'
import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { Provider } from '@web3-react/types'
import retrieve from '$/features/delegation/helpers/retrieve'
import handleError from '$/utils/handleError'
import i18n from '$/utils/I18n'

export default function delegationPreflight({
    requester,
    provider,
}: {
    requester: Address
    provider: Provider
}) {
    return call(function* () {
        let retrievedAccess = false

        let confirm: ToastController<typeof Toast> | undefined

        try {
            let delegatedAccount: OptionalAddress = yield select(selectDelegatedAccount)

            if (!delegatedAccount) {
                retrievedAccess = true

                yield put(FlagAction.set(Flag.isAccessBeingDelegated(requester)))

                confirm = yield toaster(Toast, {
                    title: i18n('delegationToast.title'),
                    type: ToastType.Warning,
                    desc: i18n('delegationToast.desc'),
                    okLabel: i18n('delegationToast.okLabel'),
                    cancelLabel: i18n('delegationToast.cancelLabel'),
                })

                yield confirm?.open()

                delegatedAccount = yield retrieve({ provider, owner: requester })
            }

            return delegatedAccount
        } catch (e) {
            handleError(e)
        } finally {
            confirm?.dismiss()

            if (retrievedAccess) {
                yield put(FlagAction.unset(Flag.isAccessBeingDelegated(requester)))
            }
        }
    })
}
