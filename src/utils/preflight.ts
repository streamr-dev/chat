import { BigNumber, providers } from 'ethers'
import { Address } from '$/types'
import networkPreflight from './networkPreflight'
import InsufficientFundsError from '$/errors/InsufficientFundsError'
import { call } from 'redux-saga/effects'
import { JSON_RPC_URL } from '$/consts'

export default function preflight(account: Address) {
    return call(function* () {
        yield networkPreflight()

        const balance: BigNumber = yield new providers.JsonRpcProvider(JSON_RPC_URL).getBalance(
            account
        )

        if (balance.eq(0)) {
            throw new InsufficientFundsError()
        }
    })
}
