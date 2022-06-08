import { Provider } from '@web3-react/types'
import { Wallet } from 'ethers'
import { Address } from '../../types/common'
import MissingDelegationError from '../errors/MissingDelegationError'
import networkPreflight from './networkPreflight'
import retrieveDelegatedPrivateKey from './retrieveDelegatedPrivateKey'
import storeDelegatedPrivateKey from './storeDelegatedPrivateKey'

export default async function requestDelegatedPrivateKey(provider: Provider, address: Address) {
    let privateKey: string

    await networkPreflight(provider)

    try {
        privateKey = await retrieveDelegatedPrivateKey({
            provider,
            address,
        })
    } catch (e: any) {
        if (!(e instanceof MissingDelegationError)) {
            throw e
        }

        privateKey = Wallet.createRandom().privateKey

        await storeDelegatedPrivateKey({
            provider,
            address,
            privateKey,
        })
    }

    return privateKey
}
