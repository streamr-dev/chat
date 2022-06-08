import { BigNumber, providers } from 'ethers'
import { PreflightParams } from '../../types/common'
import InsufficientFundsError from '../errors/InsufficientFundsError'

export default async function requirePositiveBalance({ address, provider }: PreflightParams) {
    const balance: BigNumber = await new providers.Web3Provider(provider).getBalance(address)

    if (balance.eq(0)) {
        throw new InsufficientFundsError()
    }
}
