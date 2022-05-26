export type RoomId = string

export interface Room {
    createdAt: number
    createdBy: string
    id: string
    name?: undefined | string
    recentMessage?: undefined | string
}

export interface RoomsState {
    ids: RoomId[]
    items: {
        [index: RoomId]: Room
    }
    selectedId: undefined | RoomId
}

export interface CreateRoomPayload {
    createdAt: number
    createdBy: string
    name: string
}
