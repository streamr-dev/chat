import { IRecord } from '../../../types/common'

export interface RoomsState {
    selectedId: undefined | RoomId
}

export interface IRoom extends IRecord {
    createdAt: number
    createdBy: string
    id: string
    name: string
    privacy: string
    useStorage: boolean
}

export type RoomId = IRoom['id']
