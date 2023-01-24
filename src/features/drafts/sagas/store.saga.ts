import { throttle } from 'redux-saga/effects'
import { DraftAction } from '..'
import db from '$/utils/db'
import handleError from '$/utils/handleError'

async function onStoreAction({ payload: draft }: ReturnType<typeof DraftAction.store>) {
    try {
        const { roomId, content } = draft

        const owner = draft.owner.toLowerCase()

        const numModded: number = await db.drafts.where({ owner, roomId }).modify({ content })

        if (numModded === 0) {
            await db.drafts.add({ ...draft, owner })
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* store() {
    yield throttle(1000, DraftAction.store, onStoreAction)
}
