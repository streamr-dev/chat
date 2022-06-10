import { MemberAction } from '$/features/member'
import { selectIsBeingAdded } from '$/features/member/selectors'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import { StreamPermission } from 'streamr-client'
import { toast } from 'react-toastify'

function* onAddAction({ payload: { roomId, address } }: ReturnType<typeof MemberAction.add>) {
    let dirty = false

    let toastId

    try {
        const adding: boolean = yield select(selectIsBeingAdded(roomId, address))

        if (adding) {
            error(`"${address} is already being added."`)
            return
        }

        yield put(
            MemberAction.setOngoingAddition({
                roomId,
                address,
                state: true,
            })
        )

        toastId = toast.loading(`Adding "${address}"…`, {
            position: 'bottom-left',
            autoClose: false,
            type: 'info',
            closeOnClick: false,
            hideProgressBar: true,
        })

        dirty = true

        yield call(setMultiplePermissions, roomId, [
            {
                user: address,
                permissions: [StreamPermission.GRANT],
            },
        ])

        success(`"${address}" successfully added.`)
    } catch (e) {
        handleError(e)

        error(`Failed to add "${address}".`)
    } finally {
        if (dirty) {
            yield put(
                MemberAction.setOngoingAddition({
                    roomId,
                    address,
                    state: false,
                })
            )
        }

        if (toastId) {
            toast.dismiss(toastId)
        }
    }
}

export default function* add() {
    yield takeEvery(MemberAction.add, onAddAction)
}
