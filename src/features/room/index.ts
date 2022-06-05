import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '../../utils/consts'
import create from './sagas/create.saga'
import del from './sagas/del.saga'
import delLocal from './sagas/delLocal.saga'
import rename from './sagas/rename.saga'
import renameLocal from './sagas/renameLocal.saga'
import sync from './sagas/sync.saga'
import { IRoom, RoomId, RoomState } from './types'

const initialState: RoomState = {
    selectedId: undefined,
}

export const RoomAction = {
    create: createAction<IRoom>('room: create'),
    delete: createAction<RoomId>('room: delete'),
    deleteLocal: createAction<RoomId>('room: delete local'),
    rename: createAction<{ roomId: RoomId; name: string }>('room: rename'),
    renameLocal: createAction<{ roomId: RoomId; name: string }>('room: rename local'),
    select: createAction<RoomState['selectedId']>('room: select'),
    sync: createAction<RoomId>('room: sync'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(RoomAction.create, SEE_SAGA)

    builder.addCase(RoomAction.rename, SEE_SAGA)

    builder.addCase(RoomAction.renameLocal, SEE_SAGA)

    builder.addCase(RoomAction.select, (state, { payload: selectedId }) => {
        state.selectedId = selectedId
    })

    builder.addCase(RoomAction.delete, SEE_SAGA)

    builder.addCase(RoomAction.deleteLocal, SEE_SAGA)

    builder.addCase(RoomAction.sync, SEE_SAGA)
})

export function* roomSaga() {
    yield all([create(), del(), delLocal(), rename(), renameLocal(), sync()])
}

export default reducer
