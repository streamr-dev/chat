import { DraftAction } from '$/features/drafts'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { call } from 'redux-saga/effects'

export default function storeDraft(draft: ReturnType<typeof DraftAction.store>['payload']) {
    return call(function* () {
        try {
            const { roomId, content } = draft

            const owner = draft.owner.toLowerCase()

            const numModded: number = yield db.drafts.where({ owner, roomId }).modify({ content })

            if (numModded === 0) {
                yield db.drafts.add({ ...draft, owner })
            }
        } catch (e) {
            handleError(e)
        }
    })
}
