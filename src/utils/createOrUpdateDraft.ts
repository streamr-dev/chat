import { storeDraft } from '../features/drafts/actions'
import db from './db'

export default async function createOrUpdateDraft(draft: ReturnType<typeof storeDraft>['payload']) {
    const { roomId, content } = draft

    const owner = draft.owner.toLowerCase()

    const count: number = await db.drafts.where({ owner, roomId }).count()

    if (!count) {
        await db.drafts.add({ ...draft, owner })
        return
    }

    await db.drafts.where({ owner, roomId }).modify({ content })
}
