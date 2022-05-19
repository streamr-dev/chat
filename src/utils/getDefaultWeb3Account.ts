import { ethers } from 'ethers'

type Account = string | undefined | null

export default async function getDefaultWeb3Account(
    ethereumProvider: any
): Promise<Account> {
    if (!ethereumProvider) {
        return undefined
    }

    let accounts: string[] = []

    try {
        // accounts = await ethereumProvider.listAccounts()
        accounts = await ethereumProvider.listAccounts()
    } catch (e) {
        console.warn(e)
    }

    if (!Array.isArray(accounts)) {
        accounts = []
    }

    return accounts[0] || null
}
