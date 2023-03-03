import { Address } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import { Provider } from '@web3-react/types'

export default async function isAuthorizedDelegatedAccount(
    metamaskAccount: Address,
    delegatedAccount: Address,
    provider: Provider
): Promise<boolean> {
    const contract = getDelegatedAccessRegistry(provider)

    const [isAuthorized]: boolean[] = await contract.functions.isUserAuthorized(
        metamaskAccount,
        delegatedAccount
    )

    return isAuthorized
}
