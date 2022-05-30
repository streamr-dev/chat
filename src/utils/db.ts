import Dexie, { Table } from 'dexie'
import { IRecord } from '../../types/common'
import { IDelegation } from '../features/delegation/types'
import { IDraft } from '../features/drafts/types'
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

    drafts!: Table<IDraft, number>

    delegations!: Table<IDelegation, number>

    constructor() {
        super('StreamrChatDatabase')

        this.version(3).stores({
            rooms: '++, owner, id, &[owner+id]',
            messages: '++, owner, id, roomId, &[owner+roomId+id], [owner+roomId]',
            aliases: '++, owner, account, &[owner+account]',
            drafts: '++, owner, roomId, &[owner+roomId]',
            delegations: '++, &owner',
        })
    }
}

const db = new StreamrChatDatabase()

export default db
