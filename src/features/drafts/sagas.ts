import { throttle } from 'redux-saga/effects'
import { DraftAction, storeDraft } from './actions'
import createOrUpdateDraft from '../../utils/createOrUpdateDraft'
import handleError from '../../utils/handleError'

export default function* draftsSaga() {
    yield throttle(
        1000,
        DraftAction.StoreDraft,
        function* ({ payload }: ReturnType<typeof storeDraft>) {
            try {
                yield createOrUpdateDraft(payload)
            } catch (e) {
                handleError(e)
            }
        }
    )
}
