import { JSON_RPC_URL } from '$/consts'
import { Address } from '$/types'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import { providers } from 'ethers'
import { call } from 'redux-saga/effects'

export enum AccountType {
    Main = 'main',
    Delegated = 'delegated',
    Unset = 'unset',
}

export default function* getAccountType(account: Address) {
    let type: AccountType | undefined

    yield call(function* () {
        const contract = getDelegatedAccessRegistry(new providers.JsonRpcProvider(JSON_RPC_URL))

        try {
            const [metamaskAccount]: boolean[] = yield contract.functions.isMainWallet(account)

            if (metamaskAccount) {
                return void (type = AccountType.Main)
            }
        } catch (e) {
            // Proceed.
        }

        try {
            const [delegatedAccount]: boolean[] = yield contract.functions.isDelegatedWallet(
                account
            )

            if (delegatedAccount) {
                return void (type = AccountType.Delegated)
            }
        } catch (e) {
            // Proceed.
        }

        type = AccountType.Unset
    })

    if (!type) {
        throw new Error('Invalid account type')
    }

    return type
}
