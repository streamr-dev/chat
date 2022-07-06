import { Provider } from '@web3-react/types'
import { providers, utils, Wallet } from 'ethers'
import { Address } from '$/types'
import networkPreflight from './networkPreflight'
import handleError from '$/utils/handleError'
import jschkdf from 'js-crypto-hkdf'

export default async function requestDelegatedPrivateKey(provider: Provider, owner: Address) {
    let privateKey: undefined | string

    await networkPreflight(provider)

    try {
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

        privateKey = new Wallet(derivedKeyHexString).privateKey
    } catch (e) {
        handleError(e)
    }

    return privateKey
}
