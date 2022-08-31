import { Address } from '$/types'
import handleError from '$/utils/handleError'
import { Provider } from '@web3-react/types'
import { providers } from 'ethers'

export default async function getAccount(provider: Provider): Promise<null | Address> {
    const web3Provider = new providers.Web3Provider(provider)

    let accounts: string[] = []

    try {
        accounts = await web3Provider.listAccounts()
    } catch (e) {
        handleError(e)
    }

    return accounts[0] || null
}
