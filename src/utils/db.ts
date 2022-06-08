import Dexie, { Table } from 'dexie'
import { IRecord } from '../../types/common'
import { IDelegation } from '../features/delegation/types'
import { IDraft } from '../features/drafts/types'
import { IdenticonSeed, IIdenticon } from '../features/identicons/types'
import { IMessage } from '../features/message/types'
import { IRoom } from '../features/room/types'

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

    identicons!: Table<IIdenticon, IdenticonSeed>

    constructor() {
        super('StreamrChatDatabase')

        this.version(4).stores({
            rooms: '++, owner, id, &[owner+id]',
            messages: '++, owner, id, roomId, &[owner+roomId+id], [owner+roomId]',
            aliases: '++, owner, account, &[owner+account]',
            drafts: '++, owner, roomId, &[owner+roomId]',
            delegations: '++, &owner',
            identicons: '++, &seed',
        })
    }
}

const db = new StreamrChatDatabase()

export default db
