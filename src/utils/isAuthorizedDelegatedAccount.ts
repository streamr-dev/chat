import { Address } from '$/types'
import handleError from '$/utils/handleError'
import { Contract, providers } from 'ethers'
import * as DelegatedAccessRegistry from '../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'
const DelegatedAccessRegistryAddress = '0xf5803cdA6352c515Ee11256EAA547BE8422cC4EE'

export default async function isAuthorizedDelegatedAccount(
    metamaskAccount: Address,
    delegatedAccount: Address,
    rawProvider: any
): Promise<boolean> {
    const provider = new providers.Web3Provider(rawProvider)
    const contract = new Contract(
        DelegatedAccessRegistryAddress,
        DelegatedAccessRegistry.abi,
        provider
    )

    const [isAuthorized]: boolean[] = await contract.functions.isUserAuthorized(
        metamaskAccount,
        delegatedAccount
    )

    return isAuthorized
}
