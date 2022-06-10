import { MemberAction } from '$/features/member'
import { selectIsBeingRemoved } from '$/features/member/selectors'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'

function* onRemoveAction({ payload: { roomId, address } }: ReturnType<typeof MemberAction.remove>) {
    let dirty = false

    try {
        const removing: boolean = yield select(selectIsBeingRemoved(roomId, address))

        if (removing) {
            error(`"${address}" is already being removed.`)
            return
        }

        yield put(
            MemberAction.setOngoingRemoval({
                roomId,
                address,
                state: true,
            })
        )

        dirty = true

        yield call(setMultiplePermissions, roomId, [
            {
                user: address,
                permissions: [],
            },
        ])

        success(`"${address}" successfully removed.`)
    } catch (e) {
        handleError(e)

        error(`Failed to remove "${address}".`)
    } finally {
        if (dirty) {
            yield put(
                MemberAction.setOngoingRemoval({
                    roomId,
                    address,
                    state: false,
                })
            )
        }
    }
}

export default function* remove() {
    yield takeEvery(MemberAction.remove, onRemoveAction)
}
