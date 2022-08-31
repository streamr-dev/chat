import { Provider } from '@web3-react/types'
import { providers, utils, Wallet } from 'ethers'
import { Address } from '$/types'
import networkPreflight from './networkPreflight'
import jschkdf from 'js-crypto-hkdf'

export default async function requestDelegatedPrivateKey(provider: Provider, owner: Address) {
    await networkPreflight(provider)

    const signature = await new providers.Web3Provider(provider)
        .getSigner()
        .signMessage(
            `[thechat.eth] This message is for deriving a session key for: ${owner.toLowerCase()}`
        )

    // Use HKDF to derive a key from the entropy of the signature
    const derivedKeyByteArray = await jschkdf.compute(
        utils.arrayify(signature),
        'SHA-256',
        32,
        '',
        utils.arrayify(utils.toUtf8Bytes('thechat.eth')) // salt
    )

    const derivedKeyHexString = utils.hexlify(derivedKeyByteArray.key)

    return new Wallet(derivedKeyHexString).privateKey
}
