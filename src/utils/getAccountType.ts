import { Address } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import getWalletProvider from '$/utils/getWalletProvider'

export enum AccountType {
    Main = 'main',
    Delegated = 'delegated',
    Unset = 'unset',
}

export default function* getAccountType(account: Address) {
    const provider = yield* getWalletProvider()

    const contract = getDelegatedAccessRegistry(provider)

    try {
        const [metamaskAccount]: boolean[] = yield contract.functions.isMainWallet(account)

        if (metamaskAccount) {
            return AccountType.Main
        }
    } catch (e) {
        // Proceed.
    }

    try {
        const [delegatedAccount]: boolean[] = yield contract.functions.isDelegatedWallet(account)

        if (delegatedAccount) {
            return AccountType.Delegated
        }
    } catch (e) {
        // Proceed.
    }

    return AccountType.Unset
}
