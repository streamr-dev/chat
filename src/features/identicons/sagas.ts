import Identicon, { IdenticonOptions } from 'identicon.js'
import { delay, put, select, takeEvery } from 'redux-saga/effects'
import db from '../../utils/db'
import { retrieveIdenticon, setIdenticon, setRetrieving } from './actions'
import { IdenticonAction, IIdenticon } from './types'
import { keccak256 } from 'js-sha3'
import { selectRetrievingIdenticon } from './selectors'
import handleError from '../../utils/handleError'

const AVATAR_OPTIONS: IdenticonOptions = {
    size: 40,
    background: [0, 0, 0, 0],
    margin: 0.2,
}

function* onRetrieveAction({ payload: seedParam }: ReturnType<typeof retrieveIdenticon>) {
    try {
        const seed = seedParam.toLowerCase()

        const retrieving: boolean = yield select(selectRetrievingIdenticon(seed))

        if (retrieving) {
            // We're in the middle of a thing.
            return
        }

        yield put(
            setRetrieving({
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
                yield put(setIdenticon(identicon))
                return
            }

            const newIdenticon = {
                seed,
                content: new Identicon(keccak256(seed), AVATAR_OPTIONS).toString(),
            }

            try {
                yield db.identicons.put(newIdenticon)
            } catch (e) {
                console.log(identicon, newIdenticon)
                throw e
            }

            yield put(setIdenticon(newIdenticon))
        } finally {
            yield put(
                setRetrieving({
                    seed,
                    value: false,
                })
            )
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* identiconsSaga() {
    yield takeEvery(IdenticonAction.Retrieve, onRetrieveAction)
}
