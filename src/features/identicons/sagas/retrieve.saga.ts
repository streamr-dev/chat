import Identicon, { IdenticonOptions } from 'identicon.js'
import { put } from 'redux-saga/effects'
import { keccak256 } from 'js-sha3'
import { IdenticonAction } from '..'
import { IIdenticon } from '../types'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'

const AVATAR_OPTIONS: IdenticonOptions = {
    size: 40,
    background: [0, 0, 0, 0],
    margin: 0.2,
}

function* onRetrieveAction({ payload: { seed } }: ReturnType<typeof IdenticonAction.retrieve>) {
    try {
        const identicon: undefined | IIdenticon = yield db.identicons
            .where('seed')
            .equals(seed)
            .first()

        if (identicon) {
            yield put(IdenticonAction.set(identicon))
            return
        }

        const newIdenticon = {
            seed,
            content: new Identicon(keccak256(seed), AVATAR_OPTIONS).toString(),
        }

        yield db.identicons.put(newIdenticon)

        yield put(IdenticonAction.set(newIdenticon))
    } catch (e) {
        handleError(e)
    }
}

export default function* retrieve() {
    yield takeEveryUnique(IdenticonAction.retrieve, onRetrieveAction)
}
