import { call, takeEvery } from 'redux-saga/effects'
import { RoomAction } from '..'
import { Address } from '$/types'
import getWalletAccount from '$/sagas/getWalletAccount.saga'
import db from '$/utils/db'
import handleError from '$/utils/handleError'

function* onDeleteLocalAction({ payload: roomId }: ReturnType<typeof RoomAction.deleteLocal>) {
    try {
        const address: Address = yield call(getWalletAccount)

        const owner = address.toLowerCase()

        // Delete room messages for a given record owner.
        yield db.messages.where({ owner, roomId }).delete()

        // Delete room for a given record owner.
        yield db.rooms.where({ owner, id: roomId }).delete()
    } catch (e) {
        handleError(e)
    }
}

export default function* delLocal() {
    yield takeEvery(RoomAction.deleteLocal, onDeleteLocalAction)
}
