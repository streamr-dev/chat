import { JSON_RPC_URL } from '$/consts'
import { Address } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import { providers } from 'ethers'

export default async function isAuthorizedDelegatedAccount(
    metamaskAccount: Address,
    delegatedAccount: Address
): Promise<boolean> {
    const contract = getDelegatedAccessRegistry(new providers.JsonRpcProvider(JSON_RPC_URL))

    const [isAuthorized]: boolean[] = await contract.functions.isUserAuthorized(
        metamaskAccount,
        delegatedAccount
    )

    return isAuthorized
}
