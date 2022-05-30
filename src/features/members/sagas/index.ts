import { all } from 'redux-saga/effects'
import detectMembersSaga from './detectMembersSaga'
import setMemberPermissionsSaga from './setMemberPermissionsSaga'

export default function* membersSaga() {
    yield all([detectMembersSaga(), setMemberPermissionsSaga()])
}
