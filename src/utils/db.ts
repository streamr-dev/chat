import Dexie, { Table } from 'dexie'
import { RoomId } from './types'

export type LocalMessage = {
    roomId: RoomId
    serialized: string
}

export class DexieDB extends Dexie {
    messages!: Table<LocalMessage>

    constructor() {
        super('streamr-client')
        this.version(7).stores({
            messages: '++id, roomId',
        })
    }
}

export const db = new DexieDB()
