import Identicon, { IdenticonOptions } from 'identicon.js'
import { delay, put, select, takeEvery } from 'redux-saga/effects'
import { keccak256 } from 'js-sha3'
import { IdenticonAction } from '..'
import { selectRetrievingIdenticon } from '../selectors'
import { IIdenticon } from '../types'
import db from '../../../utils/db'
import handleError from '../../../utils/handleError'

const AVATAR_OPTIONS: IdenticonOptions = {
    size: 40,
    background: [0, 0, 0, 0],
    margin: 0.2,
}

function* onRetrieveAction({ payload: seedParam }: ReturnType<typeof IdenticonAction.retrieve>) {
    try {
        const seed = seedParam.toLowerCase()

        const retrieving: boolean = yield select(selectRetrievingIdenticon(seed))

        if (retrieving) {
            // We're in the middle of a thing.
            return
        }

        yield put(
            IdenticonAction.setRetrieving({
                seed,
                value: true,
            })
        )

        // For debugging. Remove at some point.
        yield delay(1000)

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
        } finally {
            yield put(
                IdenticonAction.setRetrieving({
                    seed,
                    value: false,
                })
            )
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* retrieve() {
    yield takeEvery(IdenticonAction.retrieve, onRetrieveAction)
}
