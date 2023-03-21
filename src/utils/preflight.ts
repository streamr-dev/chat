import { BigNumber, providers } from 'ethers'
import { Address } from '$/types'
import networkPreflight from './networkPreflight'
import InsufficientFundsError from '$/errors/InsufficientFundsError'
import { call, put } from 'redux-saga/effects'
import { JSON_RPC_URL } from '$/consts'
import { ToasterAction } from '$/features/toaster'
import { ToastType } from '$/components/Toast'

export default function preflight(account: Address) {
    return call(function* () {
        try {
            yield networkPreflight()

            const balance: BigNumber = yield new providers.JsonRpcProvider(JSON_RPC_URL).getBalance(
                account
            )

            if (balance.eq(0)) {
                throw new InsufficientFundsError()
            }
        } catch (e) {
            if (e instanceof InsufficientFundsError) {
                yield put(
                    ToasterAction.show({
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
