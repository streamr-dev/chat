import { EnsAction } from '$/features/ens'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'

async function onStoreAction({
    payload: {
        record: { address, content },
    },
}: ReturnType<typeof EnsAction.store>) {
    try {
        const entry = {
            address: address.toLowerCase(),
            content: content.toLowerCase(),
        }

        const numUpdated = await db.ensNames.where({ content: entry.content }).modify(entry)

        if (numUpdated === 0) {
            await db.ensNames.add(entry)
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* store() {
    yield takeEveryUnique(EnsAction.store, onStoreAction)
}
