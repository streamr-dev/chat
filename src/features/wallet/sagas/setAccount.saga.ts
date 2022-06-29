import { put, takeEvery } from 'redux-saga/effects'
import { WalletAction } from '..'
import handleError from '$/utils/handleError'
import { DelegationAction } from '../../delegation'
import { RoomAction } from '$/features/room'
import { IPreference } from '$/features/preferences/types'
import db from '$/utils/db'
import { EnsAction } from '$/features/ens'

function* preselectRoom({ payload: account }: ReturnType<typeof WalletAction.setAccount>) {
    try {
        if (!account) {
            yield put(RoomAction.select(undefined))
            return
        }

        const preferences: null | IPreference = yield db.preferences
            .where('owner')
            .equals(account.toLowerCase())
            .first()

        if (!preferences) {
            yield put(RoomAction.select(undefined))
            return
        }

        yield put(RoomAction.select(preferences.selectedRoomId))
    } catch (e) {
        handleError(e)
    }
}

function* resetDelegatedPrivateKey() {
    try {
        yield put(DelegationAction.setPrivateKey(undefined))
    } catch (e) {
        handleError(e)
    }
}

function* fetchEns({ payload: address }: ReturnType<typeof WalletAction.setAccount>) {
    if (!address) {
        return
    }

    yield put(EnsAction.fetchNames([address]))
}

export default function* setAccount() {
    yield takeEvery(WalletAction.setAccount, fetchEns)
    yield takeEvery(WalletAction.setAccount, preselectRoom)
    yield takeEvery(WalletAction.setAccount, resetDelegatedPrivateKey)
}
