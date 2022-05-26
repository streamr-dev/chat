import { put } from 'redux-saga/effects'
import { setDelegatedPrivateKey } from '../actions'

export default function* resetDelegatedPrivateKeySaga() {
    yield put(setDelegatedPrivateKey(undefined))
}
