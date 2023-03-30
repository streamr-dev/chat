import { JSON_RPC_URL, ZeroAddress } from '$/consts'
import { DelegationAction } from '$/features/delegation'
import { selectMainAccount } from '$/hooks/useMainAccount'
import { Address, OptionalAddress } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import handleError from '$/utils/handleError'
import isSameAddress from '$/utils/isSameAddress'
import { providers } from 'ethers'
import { call, delay, put, race, select } from 'redux-saga/effects'

export default function lookup({
    delegated,
}: ReturnType<typeof DelegationAction.lookup>['payload']) {
    return call(function* () {
        try {
            const mapping: OptionalAddress = yield select(selectMainAccount(delegated))

            if (mapping) {
                // We already know that pair. Skip.
                return
            }

            yield race([
                call(function* () {
                    yield delay(5000)

                    throw new Error('Timeout')
                }),
                call(function* () {
                    const contract = getDelegatedAccessRegistry(
                        new providers.JsonRpcProvider(JSON_RPC_URL)
                    )

                    let [main]: [Address] = yield contract.functions.getMainWalletFor(delegated)

                    if (isSameAddress(main, ZeroAddress)) {
                        // If a given delegatee does not map to any main account it'll return the "zero"
                        // address. Fall back to the given address.
                        main = delegated
                    }

                    yield put(
                        DelegationAction.cacheDelegation({
                            main,
                            delegated,
                        })
                    )
                }),
            ])
        } catch (e) {
            handleError(e)

            yield put(
                DelegationAction.cacheDelegation({
                    main: null,
                    delegated,
                })
            )
        }
    })
}
