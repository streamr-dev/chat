import Toast, { ToastType } from '$/components/Toast'
import { selectDelegatedAccount } from '$/features/delegation/selectors'
import { Layer, toaster } from '$/utils/toaster'
import { Address, OptionalAddress } from '$/types'
import { call, put, select } from 'redux-saga/effects'
import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import retrieve from '$/features/delegation/helpers/retrieve'
import i18n from '$/utils/i18n'

export default function delegationPreflight(requester: Address) {
    return call(function* () {
        let retrievedAccess = false

        const confirm = toaster(Toast, Layer.Toast)

        let delegatedAccount: OptionalAddress

        try {
            delegatedAccount = yield select(selectDelegatedAccount)

            if (delegatedAccount) {
                return delegatedAccount
            }

            retrievedAccess = true

            yield put(FlagAction.set(Flag.isAccessBeingDelegated(requester)))

            yield confirm.pop({
                title: i18n('delegationToast.title'),
                type: ToastType.Warning,
                desc: i18n('delegationToast.desc'),
                okLabel: i18n('delegationToast.okLabel'),
                cancelLabel: i18n('delegationToast.cancelLabel'),
            })

            return (yield retrieve({ owner: requester })) as string
        } finally {
            confirm.discard()

            if (retrievedAccess) {
                yield put(FlagAction.unset(Flag.isAccessBeingDelegated(requester)))
            }
        }
    })
}
