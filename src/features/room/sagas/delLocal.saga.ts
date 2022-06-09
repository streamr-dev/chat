import { call, put, select, takeEvery } from 'redux-saga/effects'
import { RoomAction } from '..'
import { Address } from '$/types'
import getWalletAccount from '$/sagas/getWalletAccount.saga'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { selectSelectedRoomId } from '../selectors'
import { IRoom, RoomState } from '../types'

function* onDeleteLocalAction({ payload: roomId }: ReturnType<typeof RoomAction.deleteLocal>) {
    try {
        const address: Address = yield call(getWalletAccount)

        const owner = address.toLowerCase()

        // Delete room messages for a given record owner.
        yield db.messages.where({ owner, roomId }).delete()

        // Delete room for a given record owner.
        yield db.rooms.where({ owner, id: roomId }).delete()

        const selectedRoomId: RoomState['selectedId'] = yield select(selectSelectedRoomId)

        if (selectedRoomId !== roomId) {
            return
        }

        // Select a different room.
        const room: undefined | IRoom = yield db.rooms.where({ owner }).first()

        yield put(RoomAction.select(room ? room.id : undefined))
    } catch (e) {
        handleError(e)
    }
}

export default function* delLocal() {
    yield takeEvery(RoomAction.deleteLocal, onDeleteLocalAction)
}
