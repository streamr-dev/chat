import { call, takeEvery } from 'redux-saga/effects'
import { MemberAction } from '..'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'

export default function* setPermissions() {
    yield takeEvery(
        MemberAction.setPermissions,
        function* ({
            payload: { roomId, assignments },
        }: ReturnType<typeof MemberAction.setPermissions>) {
            try {
                yield call(setMultiplePermissions, roomId, assignments)
            } catch (e) {
                handleError(e)
            }
        }
    )
}
