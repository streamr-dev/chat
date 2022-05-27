import { all } from 'redux-saga/effects'
import createMessageSaga from './createMessageSaga'

export default function* saga() {
    yield all([createMessageSaga()])
}
