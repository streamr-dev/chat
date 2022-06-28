import { Provider } from '@web3-react/types'
import { Wallet } from 'ethers'
import { Address } from '$/types'
import MissingDelegationError from '$/errors/MissingDelegationError'
import networkPreflight from './networkPreflight'
import retrieveDelegatedPrivateKey from './retrieveDelegatedPrivateKey'
import storeDelegatedPrivateKey from './storeDelegatedPrivateKey'

export default async function requestDelegatedPrivateKey(provider: Provider, owner: Address) {
    let privateKey: string

    await networkPreflight(provider)

    try {
        privateKey = await retrieveDelegatedPrivateKey({
            provider,
            owner,
        })
    } catch (e: any) {
        if (!(e instanceof MissingDelegationError)) {
            throw e
        }

        privateKey = Wallet.createRandom().privateKey

        await storeDelegatedPrivateKey({
            provider,
            owner,
            privateKey,
        })
    }

    return privateKey
}
