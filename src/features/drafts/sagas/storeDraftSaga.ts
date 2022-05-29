import { throttle } from 'redux-saga/effects'
import db from '../../../utils/db'
import { DraftAction, storeDraft } from '../actions'

function* onStoreDraftAction({ payload }: ReturnType<typeof storeDraft>) {
    try {
        const { roomId, content } = payload

        const owner = payload.owner.toLowerCase()

        const count: number = yield db.drafts.where({ owner, roomId }).count()

        if (!count) {
            yield db.drafts.add({ ...payload, owner })
            return
        }

        yield db.drafts.where({ owner, roomId }).modify({ content })
    } catch (e) {
        console.warn('Failed to store a draft.', e)
    }
}

export default function* storeDraftSaga() {
    yield throttle(1000, DraftAction.StoreDraft, onStoreDraftAction)
}
