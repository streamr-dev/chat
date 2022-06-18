import { MemberAction } from '$/features/member'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call } from 'redux-saga/effects'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import { StreamPermission } from 'streamr-client'
import { toast } from 'react-toastify'
import takeEveryUnique from '$/utils/takeEveryUnique'

function* onAddAction({ payload: { roomId, address } }: ReturnType<typeof MemberAction.add>) {
    let toastId

    let succeeded = false

    try {
        toastId = toast.loading(`Adding "${address}"…`, {
            position: 'bottom-left',
            autoClose: false,
            type: 'info',
            closeOnClick: false,
            hideProgressBar: true,
        })

        yield call(setMultiplePermissions, roomId, [
            {
                user: address,
                permissions: [StreamPermission.GRANT],
            },
        ])

        succeeded = true
    } catch (e) {
        handleError(e)
    } finally {
        if (toastId) {
            toast.dismiss(toastId)
        }
    }

    if (succeeded) {
        success(`"${address}" successfully added.`)
        return
    }

    error(`Failed to add "${address}".`)
}

export default function* add() {
    yield takeEveryUnique(MemberAction.add, onAddAction)
}
