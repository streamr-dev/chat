import { ZeroAddress } from '$/consts'
import { DelegationAction } from '$/features/delegation'
import { selectMainAccount } from '$/hooks/useMainAccount'
import { Address, OptionalAddress } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import getWalletProvider from '$/utils/getWalletProvider'
import handleError from '$/utils/handleError'
import isSameAddress from '$/utils/isSameAddress'
import networkPreflight from '$/utils/networkPreflight'
import { call, delay, put, race, select } from 'redux-saga/effects'

export default function lookup({
    delegated,
}: ReturnType<typeof DelegationAction.lookup>['payload']) {
    return call(function* () {
        try {
            const provider = yield* getWalletProvider()

            const contract = getDelegatedAccessRegistry(provider)

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
                    let [main]: [Address] = yield contract.functions.getMainWalletFor(delegated)

                    if (isSameAddress(main, ZeroAddress)) {
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
                }),
            ])
        } catch (e) {
            handleError(e)

            yield put(
                DelegationAction.setDelegation({
                    main: null,
                    delegated,
                })
            )
        }
    })
}
