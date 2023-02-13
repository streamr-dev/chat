import { DelegationAction } from '$/features/delegation'
import networkPreflight from '$/utils/networkPreflight'
import { error, loading, success } from '$/utils/toaster'
import { providers, utils, Wallet } from 'ethers'
import { Id, toast } from 'react-toastify'
import { call, put } from 'redux-saga/effects'
import jschkdf from 'js-crypto-hkdf'
import isAuthorizedDelegatedAccount from '$/utils/isAuthorizedDelegatedAccount'
import authorizeDelegatedAccount from '$/utils/authorizeDelegatedAccount'

export default function retrieve({
    provider,
    owner,
}: Pick<ReturnType<typeof DelegationAction.requestPrivateKey>['payload'], 'owner' | 'provider'>) {
    return call(function* () {
        let toastId: Id | undefined = undefined

        try {
            yield networkPreflight(provider)

            const signature: string = yield new providers.Web3Provider(provider)
                .getSigner()
                .signMessage(
                    `[thechat.eth] This message is for deriving a session key for: ${owner.toLowerCase()}`
                )

            // Use HKDF to derive a key from the entropy of the signature
            const derivedKeyByteArray: Awaited<ReturnType<typeof jschkdf.compute>> =
                yield jschkdf.compute(
                    utils.arrayify(signature),
                    'SHA-256',
                    32,
                    '',
                    utils.arrayify(utils.toUtf8Bytes('thechat.eth')) // salt
                )

            const derivedKeyHexString = utils.hexlify(derivedKeyByteArray.key)

            const { privateKey, address } = new Wallet(derivedKeyHexString)

            const isDelegationAuthorized: boolean = yield isAuthorizedDelegatedAccount(
                owner,
                address,
                provider
            )

            if (!isDelegationAuthorized) {
                toastId = loading('Authorizing your delegated wallet…')

                yield authorizeDelegatedAccount(owner, privateKey, provider)
            }

            yield put(DelegationAction.setPrivateKey(privateKey))

            success('Access delegated successfully.')

            return address
        } catch (e) {
            error('Failed to delegate access.')

            throw e
        } finally {
            if (toastId) {
                toast.dismiss(toastId)
            }
        }
    })
}
