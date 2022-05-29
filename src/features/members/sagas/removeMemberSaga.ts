import { takeEvery } from 'redux-saga/effects'
import { MemberAction, removeMember } from '../actions'

// eslint-disable-next-line @typescript-eslint/no-empty-function
function* onRemoveMemberAction({ payload: { roomId, address } }: ReturnType<typeof removeMember>) {}

export default function* removeMemberSaga() {
    yield takeEvery(MemberAction.RemoveMember, onRemoveMemberAction)
}
