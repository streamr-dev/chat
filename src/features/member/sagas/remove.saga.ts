import { MemberAction } from '$/features/member'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call } from 'redux-saga/effects'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import takeEveryUnique from '$/utils/takeEveryUnique'

function* onRemoveAction({ payload: { roomId, address } }: ReturnType<typeof MemberAction.remove>) {
    let succeeded = false

    try {
        yield call(setMultiplePermissions, roomId, [
            {
                user: address,
                permissions: [],
            },
        ])

        succeeded = true
    } catch (e) {
        handleError(e)
    }

    if (succeeded) {
        success(`"${address}" successfully removed.`)
        return
    }

    error(`Failed to remove "${address}".`)
}

export default function* remove() {
    yield takeEveryUnique(MemberAction.remove, onRemoveAction)
}
