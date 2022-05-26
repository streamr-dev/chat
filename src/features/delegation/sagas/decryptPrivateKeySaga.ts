import { Wallet } from 'ethers'
import { select, call, put } from 'redux-saga/effects'
import { StorageKey } from '../../../../types/common'
import { WalletState } from '../../../../types/wallet'
import { setDelegatedPrivateKey } from '../actions'
import { selectDelegatedPrivateKey } from '../selectors'
import { DelegationState } from '../types'
import { encrypt } from '@metamask/eth-sig-util'
import {
    selectWalletAccount,
    selectWalletProvider,
} from '../../wallet/selectors'
import ensureCorrectNetworkSaga from '../../../components/sagas/ensureCorrectNetworkSaga'

class NewWalletRequiredError extends Error {}

class MissingProviderError extends Error {}

class MissingAccountError extends Error {}

export default function* decryptPrivateKeySaga() {
    const encryptedPrivateKey =
        localStorage.getItem(StorageKey.EncryptedSession) || undefined

    const provider: WalletState['provider'] = yield select(selectWalletProvider)

    const account: WalletState['account'] = yield select(selectWalletAccount)

    const dpk: DelegationState['privateKey'] = yield select(
        selectDelegatedPrivateKey
    )

    if (dpk) {
        // Do nothing. We already have a decrypted delegated private key in the store.
        return
    }

    try {
        yield call(ensureCorrectNetworkSaga)

        if (!provider) {
            throw new MissingProviderError()
        }

        if (!account) {
            throw new MissingAccountError()
        }

        try {
            if (!encryptedPrivateKey) {
                // No encrypted private key means there's nothing to retrieve. We gotta get
                // the user a new delegation wallet.
                throw new NewWalletRequiredError()
            }

            try {
                const decrypted: string = yield provider.request({
                    method: 'eth_decrypt',
                    params: [encryptedPrivateKey, account],
                })

                yield put(
                    setDelegatedPrivateKey(JSON.parse(decrypted).privateKey)
                )
            } catch (e: any) {
                if (e.code === 4001) {
                    // User rejected the signing. Don't create a new wallet.
                    throw e
                }

                throw new NewWalletRequiredError()
            }
        } catch (e) {
            if (!(e instanceof NewWalletRequiredError)) {
                // Decryption failed and we don't want a fresh delegation wallet.
                throw e
            }

            const wallet = Wallet.createRandom()

            const encryptionPublicKey: string = yield provider.request({
                method: 'eth_getEncryptionPublicKey',
                params: [account],
            })

            localStorage.setItem(
                StorageKey.EncryptedSession,
                Buffer.from(
                    JSON.stringify(
                        encrypt({
                            publicKey: encryptionPublicKey as string,
                            data: JSON.stringify({
                                privateKey: wallet.privateKey,
                            }),
                            version: 'x25519-xsalsa20-poly1305',
                        })
                    ),
                    'utf8'
                ).toString('hex')
            )

            yield put(setDelegatedPrivateKey(wallet.privateKey))
        }
    } catch (e) {
        if (e instanceof MissingProviderError) {
            console.warn(e)
            return
        }

        if (e instanceof MissingAccountError) {
            console.warn(e)
            return
        }

        console.warn('Straight up confusion. XD', e)
    }
}
