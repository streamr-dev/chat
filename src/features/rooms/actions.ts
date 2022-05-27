import { createAction } from '@reduxjs/toolkit'
import { IRoom, RoomId, RoomsState } from './types'

export enum RoomAction {
    RenameRoom = 'rename room',
    CreateRoom = 'create room',
    SelectRoom = 'select room',
    DeleteRoom = 'delete room',
}

export const renameRoom = createAction<[RoomId, string]>(RoomAction.RenameRoom)

export const createRoom = createAction<IRoom>(RoomAction.CreateRoom)

export const selectRoom = createAction<RoomsState['selectedId']>(
    RoomAction.SelectRoom
)

export const deleteRoom = createAction<[string, RoomId]>(RoomAction.DeleteRoom)
