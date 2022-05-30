import { Provider } from '@web3-react/types'
import { Address } from '../../types/common'
import getDelegation from './getDelegation'

interface Params {
    provider: Provider
    address: Address
}

export default async function retrieveDelegatedPrivateKey({ provider, address }: Params) {
    const { encryptedPrivateKey } = await getDelegation(address)

    const payload = (await provider.request({
        method: 'eth_decrypt',
        params: [encryptedPrivateKey, address],
    })) as string

    return JSON.parse(payload).privateKey as string
}
