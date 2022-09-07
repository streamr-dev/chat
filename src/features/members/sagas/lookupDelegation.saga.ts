import { MembersAction } from '$/features/members'
import { Address } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { put } from 'redux-saga/effects'

function* onLookupDelegationAction({
    payload: { delegated, provider },
}: ReturnType<typeof MembersAction.lookupDelegation>) {
    try {
        const contract = getDelegatedAccessRegistry(provider)

        const main: Address = yield contract.methods.getMainWalletFor(delegated)

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
