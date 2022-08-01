import { Address } from '$/types'
import { getDelegatedAccessRegistryAt } from '$/utils/DelegatedAccessRegistry'

export default async function getAccountType(
    accounts: Address,
    rawProvider: any
): Promise<{ isMainAccount: boolean; isDelegatedAccount: boolean }> {
    const contract = getDelegatedAccessRegistryAt(rawProvider)

    const [metamaskAccounts]: boolean[] = await contract.functions.isMainWallet(accounts)
    const [delegatedAccounts]: boolean[] = await contract.functions.isDelegatedWallet(accounts)

    return {
        isMainAccount: metamaskAccounts,
        isDelegatedAccount: delegatedAccounts,
    }
}
