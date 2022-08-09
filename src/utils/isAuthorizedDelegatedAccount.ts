import { Address } from '$/types'
import { getDelegatedAccessRegistry } from '$/utils/DelegatedAccessRegistry'

export default async function isAuthorizedDelegatedAccount(
    metamaskAccount: Address,
    delegatedAccount: Address,
    rawProvider: any
): Promise<boolean> {
    const contract = getDelegatedAccessRegistry(rawProvider)

    const [isAuthorized]: boolean[] = await contract.functions.isUserAuthorized(
        metamaskAccount,
        delegatedAccount
    )

    return isAuthorized
}
