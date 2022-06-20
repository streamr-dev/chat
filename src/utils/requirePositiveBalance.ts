import { BigNumber, providers } from 'ethers'
import { PreflightParams } from '$/types'
import InsufficientFundsError from '$/errors/InsufficientFundsError'

export default async function requirePositiveBalance({ requester, provider }: PreflightParams) {
    const balance: BigNumber = await new providers.Web3Provider(provider).getBalance(requester)

    if (balance.eq(0)) {
        throw new InsufficientFundsError()
    }
}
