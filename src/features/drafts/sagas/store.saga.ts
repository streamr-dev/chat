import { throttle } from 'redux-saga/effects'
import { DraftAction } from '..'
import db from '$/utils/db'
import handleError from '$/utils/handleError'

function* onStoreAction({ payload: draft }: ReturnType<typeof DraftAction.store>) {
    try {
        const { roomId, content } = draft

        const owner = draft.owner.toLowerCase()

        const count: number = yield db.drafts.where({ owner, roomId }).count()

        if (!count) {
            yield db.drafts.add({ ...draft, owner })
            return
        }

        yield db.drafts.where({ owner, roomId }).modify({ content })
    } catch (e) {
        handleError(e)
    }
}

export default function* store() {
    yield throttle(1000, DraftAction.store, onStoreAction)
}
