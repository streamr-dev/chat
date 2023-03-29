import { DelegationAction } from '$/features/delegation'
import networkPreflight from '$/utils/networkPreflight'
import { utils, Wallet } from 'ethers'
import { call, cancelled, put } from 'redux-saga/effects'
import jschkdf from 'js-crypto-hkdf'
import isAuthorizedDelegatedAccount from '$/utils/isAuthorizedDelegatedAccount'
import authorizeDelegatedAccount from '$/utils/authorizeDelegatedAccount'
import { ToastType } from '$/components/Toast'
import recover from '$/utils/recover'
import i18n from '$/utils/i18n'
import getWalletProvider from '$/utils/getWalletProvider'
import retoast from '$/features/misc/helpers/retoast'
import getSigner from '$/utils/getSigner'

export default function retrieve({
    owner,
}: Pick<ReturnType<typeof DelegationAction.requestPrivateKey>['payload'], 'owner'>) {
    return call(function* () {
        const toast = retoast()

        try {
            const provider = yield* getWalletProvider()

            yield networkPreflight()

            const signature: string = yield getSigner(provider).signMessage(
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

            const isDelegationAuthorized = yield* recover(
                function* () {
                    const result: boolean = yield isAuthorizedDelegatedAccount(owner, address)

                    return result
                },
                {
                    title: i18n('isAuthorizedDelegationRecoverToast.title'),
                    desc: i18n('isAuthorizedDelegationRecoverToast.desc'),
                    okLabel: i18n('isAuthorizedDelegationRecoverToast.okLabel'),
                    cancelLabel: i18n('isAuthorizedDelegationRecoverToast.cancelLabel'),
                }
            )

            if (!isDelegationAuthorized) {
                yield toast.pop({
                    title: i18n('delegationToast.authorizingLabel'),
                    type: ToastType.Processing,
                })

                yield authorizeDelegatedAccount(owner, privateKey, provider)
            }

            yield put(DelegationAction.setPrivateKey(privateKey))

            yield toast.pop({
                title: i18n('delegationToast.successLabel'),
                type: ToastType.Success,
            })

            return address
        } catch (e) {
            yield toast.pop({
                title: i18n('delegationToast.failureLabel'),
                type: ToastType.Error,
            })

            throw e
        } finally {
            toast.discard({ asap: yield cancelled() })
        }
    })
}
