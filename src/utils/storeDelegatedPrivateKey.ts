import { Buffer } from 'buffer'
import { encrypt } from '@metamask/eth-sig-util'
import { Provider } from '@web3-react/types'
import { Address } from '$/types'
import db from './db'

interface Params {
    provider: Provider
    address: Address
    privateKey: string
}

export default async function storeDelegatedPrivateKey({ provider, address, privateKey }: Params) {
    const encryptionPublicKey = (await provider.request({
        method: 'eth_getEncryptionPublicKey',
        params: [address],
    })) as string

    const now = Date.now()

    await db.delegations.add({
        owner: address.toLowerCase(),
        createdAt: now,
        updatedAt: now,
        encryptedPrivateKey: Buffer.from(
            JSON.stringify(
                encrypt({
                    publicKey: encryptionPublicKey,
                    data: JSON.stringify({
                        privateKey,
                    }),
                    version: 'x25519-xsalsa20-poly1305',
                })
            ),
            'utf8'
        ).toString('hex'),
    })
}
