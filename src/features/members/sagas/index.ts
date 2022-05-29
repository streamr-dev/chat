import { all } from 'redux-saga/effects'
import addMemberSaga from './addMemberSaga'
import detectMembersSaga from './detectMembersSaga'
import removeMemberSaga from './removeMemberSaga'

export default function* membersSaga() {
    yield all([addMemberSaga(), removeMemberSaga(), detectMembersSaga()])
}
