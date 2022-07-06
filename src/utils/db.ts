import Dexie, { Table } from 'dexie'
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

    identicons!: Table<IIdenticon, IdenticonSeed>

    preferences!: Table<IPreference, number>

    ensNames!: Table<IENSName, number>

    constructor(version: number) {
        super(`StreamrChatDatabase_v${version}`)

        this.version(1).stores({
            rooms: '++, owner, id, &[owner+id]',
            messages: '[createdAt+roomId+owner], id, &[owner+roomId+id], [owner+roomId]',
            aliases: '++, owner, address, &[owner+address]',
            drafts: '++, owner, roomId, &[owner+roomId]',
            identicons: '++, &seed',
            preferences: '++, &owner',
            ensNames: '++, &content, address',
        })
    }
}

async function teardown() {
    try {
        await new Dexie('StreamrChatDatabase').delete()
    } catch (e) {
        // Noop.
    }

    try {
        await new Dexie('StreamrChatDatabase_v2').delete()
    } catch (e) {
        // Noop.
    }
}

teardown()

const db = new StreamrChatDatabase(3)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.db = db

export default db
