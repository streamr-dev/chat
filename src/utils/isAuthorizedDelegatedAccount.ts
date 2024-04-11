import { Address } from '$/types'
import { getJsonRpcProvider } from '$/utils'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'

export default async function isAuthorizedDelegatedAccount(
    metamaskAccount: Address,
    delegatedAccount: Address
): Promise<boolean> {
    const contract = getDelegatedAccessRegistry(getJsonRpcProvider())

    const [isAuthorized]: boolean[] = await contract.functions.isUserAuthorized(
        metamaskAccount,
        delegatedAccount
    )

    return isAuthorized
}
