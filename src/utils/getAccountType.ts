import { Address } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import { Provider } from '@web3-react/types'

export enum AccountType {
    Main = 'main',
    Delegated = 'delegated',
    Unset = 'unset',
}

export default async function getAccountType(
    account: Address,
    rawProvider: Provider
): Promise<AccountType> {
    const contract = getDelegatedAccessRegistry(rawProvider)

    const [metamaskAccount]: boolean[] = await contract.functions.isMainWallet(account)

    if (metamaskAccount) {
        return AccountType.Main
    }
    const [delegatedAccount]: boolean[] = await contract.functions.isDelegatedWallet(account)

    if (delegatedAccount) {
        return AccountType.Delegated
    }

    return AccountType.Unset
}
