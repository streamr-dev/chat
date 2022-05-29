import { all } from 'redux-saga/effects'
import storeDraftSaga from './storeDraftSaga'

export default function* draftsSaga() {
    yield all([storeDraftSaga()])
}
