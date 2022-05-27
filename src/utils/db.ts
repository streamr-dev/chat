import Dexie, { Table } from 'dexie'
import { IRecord } from '../../types/common'
import { IMessage } from '../features/messages/types'
import { IRoom } from '../features/rooms/types'

interface IAccountAlias extends IRecord {
    account: string
    alias: string
}

class StreamrChatDatabase extends Dexie {
    messages!: Table<IMessage, number>
    rooms!: Table<IRoom, number>
    accountAliases!: Table<IAccountAlias, number>

    constructor() {
        super('StreamrChatDatabase')

        this.version(1).stores({
            rooms: '++, owner, id, &[owner+id]',
            messages:
                '++, owner, id, roomId, &[owner+roomId+id], [owner+roomId]',
            aliases: '++, owner, account, &[owner+account]',
        })
    }
}

const db = new StreamrChatDatabase()

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// window.db = db

export default db
