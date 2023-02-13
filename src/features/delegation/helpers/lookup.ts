import { DelegationAction } from '$/features/delegation'
import { selectMainAccount } from '$/hooks/useMainAccount'
import { Address, OptionalAddress } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import handleError from '$/utils/handleError'
import { call, put, select } from 'redux-saga/effects'

export default function lookup({
    delegated,
    provider,
}: ReturnType<typeof DelegationAction.lookup>['payload']) {
    return call(function* () {
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
                DelegationAction.setDelegation({
                    main,
                    delegated,
                })
            )
        } catch (e) {
            handleError(e)
        }
    })
}
