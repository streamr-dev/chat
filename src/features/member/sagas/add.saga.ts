import { MemberAction } from '$/features/member'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call } from 'redux-saga/effects'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import { StreamPermission } from 'streamr-client'
import { toast } from 'react-toastify'
import takeEveryUnique from '$/utils/takeEveryUnique'

function* onAddAction({
    payload: { roomId, member, provider, requester, streamrClient },
}: ReturnType<typeof MemberAction.add>) {
    let toastId

    try {
        toastId = toast.loading(`Adding "${member}"…`, {
            position: 'bottom-left',
            autoClose: false,
            type: 'info',
            closeOnClick: false,
            hideProgressBar: true,
        })

        yield call(
            setMultiplePermissions,
            roomId,
            [
                {
                    user: member,
                    permissions: [StreamPermission.GRANT],
                },
            ],
            {
                provider,
                requester,
                streamrClient,
            }
        )

        success(`"${member}" successfully added.`)
    } catch (e) {
        handleError(e)

        error(`Failed to add "${member}".`)
    } finally {
        if (toastId) {
            toast.dismiss(toastId)
        }
    }
}

export default function* add() {
    yield takeEveryUnique(MemberAction.add, onAddAction)
}
