import { all } from 'redux-saga/effects'
import fetchPermissionSaga from './fetchPermissionSaga'

export default function* permissionsSaga() {
    yield all([fetchPermissionSaga()])
}
