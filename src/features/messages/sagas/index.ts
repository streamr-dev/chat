import { all } from 'redux-saga/effects'
import publishMessageSaga from './publishMessageSaga'

export default function* saga() {
    yield all([publishMessageSaga()])
}
