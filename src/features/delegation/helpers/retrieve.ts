import { DelegationAction } from '$/features/delegation'
import networkPreflight from '$/utils/networkPreflight'
import { providers, utils, Wallet } from 'ethers'
import { call, put } from 'redux-saga/effects'
import jschkdf from 'js-crypto-hkdf'
import isAuthorizedDelegatedAccount from '$/utils/isAuthorizedDelegatedAccount'
import authorizeDelegatedAccount from '$/utils/authorizeDelegatedAccount'
import { Controller } from '$/features/toaster/helpers/toast'
import { ToastType } from '$/components/Toast'
import retoast from '$/features/toaster/helpers/retoast'
import recover from '$/utils/recover'
import i18n from '$/utils/I18n'

export default function retrieve({
    provider,
    owner,
}: Pick<ReturnType<typeof DelegationAction.requestPrivateKey>['payload'], 'owner' | 'provider'>) {
    return call(function* () {
        let tc: Controller | undefined

        let dismissToast = false

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

            const isDelegationAuthorized = yield* recover(
                function* () {
                    const result: boolean = yield isAuthorizedDelegatedAccount(
                        owner,
                        address,
                        provider
                    )

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
                dismissToast = true

                tc = yield retoast(tc, {
                    title: i18n('delegationToast.authorizingLabel'),
                    type: ToastType.Processing,
                })

                yield authorizeDelegatedAccount(owner, privateKey, provider)
            }

            yield put(DelegationAction.setPrivateKey(privateKey))

            dismissToast = false

            tc = yield retoast(tc, {
                title: i18n('delegationToast.successLabel'),
                type: ToastType.Success,
            })

            return address
        } catch (e) {
            dismissToast = false

            tc = yield retoast(tc, {
                title: i18n('delegationToast.failureLabel'),
                type: ToastType.Error,
            })

            throw e
        } finally {
            if (dismissToast) {
                tc?.dismiss()
            }
        }
    })
}
