import { all } from 'redux-saga/effects'
import publishMessageSaga from './publishMessageSaga'
import registerMessageSaga from './registerMessageSaga'

export default function* saga() {
    yield all([publishMessageSaga(), registerMessageSaga()])
}
