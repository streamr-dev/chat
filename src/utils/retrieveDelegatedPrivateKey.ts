import { Provider } from '@web3-react/types'
import { Address } from '$/types'
import getDelegation from './getDelegation'

interface Params {
    provider: Provider
    owner: Address
}

export default async function retrieveDelegatedPrivateKey({ provider, owner }: Params) {
    const { encryptedPrivateKey } = await getDelegation(owner)

    const payload = (await provider.request({
        method: 'eth_decrypt',
        params: [encryptedPrivateKey, owner],
    })) as string

    return JSON.parse(payload).privateKey as string
}
