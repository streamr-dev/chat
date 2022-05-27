import db from '../../../utils/db'
import { put, select, takeEvery } from 'redux-saga/effects'
import { selectRoom } from '../actions'
import { setWalletAccount, WalletAction } from '../../wallet/actions'
import { IRoom, RoomId } from '../types'
import { selectSelectedRoomId } from '../selectors'

function* onAccountChange({
    payload: account,
}: ReturnType<typeof setWalletAccount>) {
    if (!account) {
        yield put(selectRoom(undefined))
        return
    }

    try {
        const rooms: IRoom[] = yield db.rooms
            .where({
                owner: account.toLowerCase(),
            })
            .toArray()

        const selectedRoomId: undefined | RoomId = yield select(
            selectSelectedRoomId
        )

        if (!rooms.length) {
            put(selectRoom(undefined))
            return
        }

        if (!selectedRoomId) {
            yield put(selectRoom(rooms[0].id))
            return
        }

        if (rooms.find(({ id }) => id === selectedRoomId)) {
            // Previous selection exists in the new set.
            return
        }

        yield put(selectRoom(rooms[0].id))
    } catch (e) {
        console.warn('Oh no!', e)
    }
}

// @TODO move it to `wallet` feature.
export default function* changeAccountSaga() {
    yield takeEvery(WalletAction.SetWalletAccount, onAccountChange)
}
