import { FlagAction } from '$/features/flag'
import { IFingerprinted } from '$/types'
import { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit'
import { Task } from 'redux-saga'
import { call, fork, put, take } from 'redux-saga/effects'

interface Memo {
    [key: string]: Task
}

export default function takeEveryUnique<T extends IFingerprinted>(
    pattern: ActionCreatorWithPayload<T>,
    worker: (action: PayloadAction<T>) => any
) {
    return fork(function* () {
        const memo: Memo = {}

        while (true) {
            const action: PayloadAction<T> = yield take(pattern)

            const { fingerprint: key } = action.payload

            if (memo[key]) {
                // Skip ongoing saga.
                continue
            }

            yield fork(function* () {
                memo[key] = yield fork(function* () {
                    try {
                        yield put(FlagAction.set(key))

                        yield call(worker, action)
                    } finally {
                        delete memo[key]

                        yield put(FlagAction.unset(key))
                    }
                })
            })
        }
    })
}
