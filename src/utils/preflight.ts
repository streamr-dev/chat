import { ToastType } from '$/components/Toast'
import InsufficientFundsError from '$/errors/InsufficientFundsError'
import { MiscAction } from '$/features/misc'
import { Address } from '$/types'
import { getJsonRpcProvider } from '$/utils'
import { BigNumber } from 'ethers'
import { call, put } from 'redux-saga/effects'
import networkPreflight from './networkPreflight'

export default function preflight(account: Address) {
    return call(function* () {
        try {
            yield networkPreflight()

            const balance: BigNumber = yield getJsonRpcProvider().getBalance(account)

            if (balance.eq(0)) {
                throw new InsufficientFundsError()
            }
        } catch (e) {
            if (e instanceof InsufficientFundsError) {
                yield put(
                    MiscAction.toast({
                        title: 'Insufficient funds',
                        desc: "You don't have enough MATIC.",
                        type: ToastType.Error,
                    })
                )
            }

            throw e
        }
    })
}
