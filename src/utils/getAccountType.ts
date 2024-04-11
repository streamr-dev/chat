import { Address } from '$/types'
import { getJsonRpcProvider } from '$/utils'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import { call } from 'redux-saga/effects'

export enum AccountType {
    Main = 'main',
    Delegated = 'delegated',
    Unset = 'unset',
}

export default function* getAccountType(account: Address) {
    let type: AccountType | undefined

    yield call(function* () {
        const contract = getDelegatedAccessRegistry(getJsonRpcProvider())

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
