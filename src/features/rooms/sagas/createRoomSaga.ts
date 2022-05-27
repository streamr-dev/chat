import db from '../../../utils/db'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createRoom, RoomAction, selectRoom } from '../actions'
import createStreamSaga from '../../../sagas/createStreamSaga'

function* onCreateRoomAction({ payload }: ReturnType<typeof createRoom>) {
    try {
        yield call(createStreamSaga, payload)

        yield db.rooms.add({
            ...payload,
            owner: payload.owner.toLowerCase(),
        })

        // Select newly created room.
        yield put(selectRoom(payload.id))
    } catch (e) {
        console.warn('Oh no!', e)
    }
}

export default function* createRoomSaga() {
    yield takeEvery(RoomAction.CreateRoom, onCreateRoomAction)
}
