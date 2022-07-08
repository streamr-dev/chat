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

const CurrentVersion = 3

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function teardown() {
    for (let i = 0; i < CurrentVersion; i++) {
        try {
            let dbName = 'StreamrChatDatabase'

            if (i !== 0) {
                dbName = `${dbName}_${i}`
            }

            await new Dexie(dbName).delete()
        } catch (e) {
            // Noop.
        }
    }
}

// If you want people to lose their local histories in previous versions uncomment
// the following line:
// teardown()

const db = new StreamrChatDatabase(CurrentVersion)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// window.db = db

export default db
