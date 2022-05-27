import db from '../../../utils/db'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createRoom, RoomAction, selectRoom } from '../actions'
import createStreamSaga from '../../../sagas/createStreamSaga'
import { Stream } from 'streamr-client'

function* onCreateRoomAction({
    payload: { owner, ...payload },
}: ReturnType<typeof createRoom>) {
    try {
        // `payload.id` is a partial room id. The real room id gets constructed by the
        // client from the given value and the account address that creates the stream.
        const stream: Stream = yield call(createStreamSaga, payload)

        yield db.rooms.add({
            ...payload,
            id: stream.id,
            owner: owner.toLowerCase(),
        })

        // Select newly created room.
        yield put(selectRoom(stream.id))
    } catch (e) {
        console.warn('Oh no!', e)
    }
}

export default function* createRoomSaga() {
    yield takeEvery(RoomAction.CreateRoom, onCreateRoomAction)
}
