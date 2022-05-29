import { createAction } from '@reduxjs/toolkit'
import { IRoom, RoomId, RoomsState } from './types'

export enum RoomAction {
    RenameRoom = 'rename room',
    CreateRoom = 'create room',
    SelectRoom = 'select room',
    DeleteRoom = 'delete room',
    SyncRoom = 'sync room',
    GetMissingRooms = 'get missing rooms',
}

export const renameRoom = createAction<[RoomId, string]>(RoomAction.RenameRoom)

export const createRoom = createAction<IRoom>(RoomAction.CreateRoom)

export const selectRoom = createAction<RoomsState['selectedId']>(
    RoomAction.SelectRoom
)

export const deleteRoom = createAction<[string, RoomId]>(RoomAction.DeleteRoom)

export const syncRoom = createAction<RoomId>(RoomAction.SyncRoom)

export const getMissingRooms = createAction(RoomAction.GetMissingRooms)