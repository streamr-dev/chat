import { BigNumber, providers } from 'ethers'
import { Address } from '$/types'
import getWalletProvider from '$/utils/getWalletProvider'
import networkPreflight from './networkPreflight'
import InsufficientFundsError from '$/errors/InsufficientFundsError'

export default function* preflight(account: Address) {
    yield* networkPreflight()

    const provider = yield* getWalletProvider()

    const balance: BigNumber = yield new providers.Web3Provider(provider).getBalance(account)

    if (balance.eq(0)) {
        throw new InsufficientFundsError()
    }
}
