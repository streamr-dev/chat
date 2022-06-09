import { all, put, select, takeEvery } from 'redux-saga/effects'
import { WalletAction } from '..'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { DelegationAction } from '../../delegation'
import { RoomAction } from '../../room'
import { selectSelectedRoomId } from '../../room/selectors'
import { IRoom, RoomId } from '../../room/types'

function* preselectRoom({ payload: account }: ReturnType<typeof WalletAction.setAccount>) {
    try {
        if (!account) {
            yield put(RoomAction.select(undefined))
            return
        }

        const rooms: IRoom[] = yield db.rooms.where('owner').equals(account.toLowerCase()).toArray()

        const selectedRoomId: undefined | RoomId = yield select(selectSelectedRoomId)

        if (!rooms.length) {
            yield put(RoomAction.select(undefined))
            return
        }

        if (!selectedRoomId) {
            yield put(RoomAction.select(rooms[0].id))
            return
        }

        if (rooms.find(({ id }) => id === selectedRoomId)) {
            // Previous selection exists in the new set.
            return
        }

        yield put(RoomAction.select(rooms[0].id))
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

export default function* setAccount() {
    yield all([
        takeEvery(WalletAction.setAccount, preselectRoom),
        takeEvery(WalletAction.setAccount, resetDelegatedPrivateKey),
    ])
}
