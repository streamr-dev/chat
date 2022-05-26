import { createAction } from '@reduxjs/toolkit'
import { CreateRoomPayload, RoomId, RoomsState } from './types'

export enum RoomAction {
    RenameRoom = 'rename room',
    CreateRoom = 'create room',
    SelectRoom = 'select room',
    SetRecentRoomMessage = 'set recent room message',
    DeleteRoom = 'delete room',
}

export const renameRoom = createAction<[RoomId, string]>(RoomAction.RenameRoom)

export const createRoom = createAction<CreateRoomPayload>(RoomAction.CreateRoom)

export const selectRoom = createAction<RoomsState['selectedId']>(
    RoomAction.SelectRoom
)

export const setRecentRoomMessage = createAction<[RoomId, string]>(
    RoomAction.SetRecentRoomMessage
)

export const deleteRoom = createAction<RoomId>(RoomAction.DeleteRoom)
