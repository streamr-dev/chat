import { EnsAction } from '$/features/ens'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { call } from 'redux-saga/effects'

export default function storeEnsDomains({
    address,
    content,
}: ReturnType<typeof EnsAction.store>['payload']['record']) {
    return call(function* () {
        try {
            const entry = {
                address: address.toLowerCase(),
                content: content.toLowerCase(),
            }

            const numUpdated = yield db.ensNames.where({ content: entry.content }).modify(entry)

            if (numUpdated === 0) {
                yield db.ensNames.add(entry)
            }
        } catch (e) {
            handleError(e)
        }
    })
}
