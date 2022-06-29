import { EnsAction } from '$/features/ens'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'

async function onStoreAction({ payload: { record } }: ReturnType<typeof EnsAction.store>) {
    try {
        const numUpdated = await db.ensNames.where({ content: record.content }).modify(record)

        if (numUpdated === 0) {
            await db.ensNames.add(record)
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* store() {
    yield takeEveryUnique(EnsAction.store, onStoreAction)
}
