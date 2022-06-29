import Dexie, { Table } from 'dexie'
import { IDelegation } from '$/features/delegation/types'
import { IDraft } from '$/features/drafts/types'
import { IdenticonSeed, IIdenticon } from '$/features/identicons/types'
import { IMessage } from '$/features/message/types'
import { IRoom } from '$/features/room/types'
import { IAlias } from '$/features/alias/types'
import { IPreference } from '$/features/preferences/types'
import { IENSName } from '$/features/ens/types'

class StreamrChatDatabase extends Dexie {
    messages!: Table<IMessage, number>

    rooms!: Table<IRoom, number>

    aliases!: Table<IAlias, number>

    drafts!: Table<IDraft, number>

    delegations!: Table<IDelegation, number>

    identicons!: Table<IIdenticon, IdenticonSeed>

    preferences!: Table<IPreference, number>

    ensNames!: Table<IENSName, number>

    constructor() {
        super('StreamrChatDatabase')

        this.version(8).stores({
            rooms: '++, owner, id, &[owner+id]',
            messages: '++, owner, id, roomId, &[owner+roomId+id], [owner+roomId]',
            aliases: '++, owner, address, &[owner+address]',
            drafts: '++, owner, roomId, &[owner+roomId]',
            delegations: '++, &owner',
            identicons: '++, &seed',
            preferences: '++, &owner',
            ensNames: '++, &content, address',
        })
    }
}

const db = new StreamrChatDatabase()

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.db = db

export default db
