import { MembersAction } from '$/features/members'
import { selectMainAccount } from '$/hooks/useMainAccount'
import { Address, OptionalAddress } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { put, select } from 'redux-saga/effects'

function* onLookupDelegationAction({
    payload: { delegated, provider },
}: ReturnType<typeof MembersAction.lookupDelegation>) {
    try {
        const contract = getDelegatedAccessRegistry(provider)

        const mapping: OptionalAddress = yield select(selectMainAccount(delegated))

        if (mapping) {
            // We already know that pair. Skip.
            return
        }

        let [main]: [Address] = yield contract.functions.getMainWalletFor(delegated)

        if (/0x0{40}/.test(main)) {
            // If a given delegatee does not map to any main account it'll return the "zero"
            // address. Fall back to the given address.
            main = delegated
        }

        yield put(
            MembersAction.setDelegation({
                main: main.toLowerCase(),
                delegated: delegated.toLowerCase(),
            })
        )
    } catch (e) {
        handleError(e)
    }
}

export default function* lookupDelegation() {
    yield takeEveryUnique(MembersAction.lookupDelegation, onLookupDelegationAction)
}
