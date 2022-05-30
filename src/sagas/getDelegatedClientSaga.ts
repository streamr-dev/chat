import { Provider } from '@web3-react/types'
import { Buffer } from 'buffer'
import { Wallet } from 'ethers'
import { call, put, select } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address } from '../../types/common'
import MissingDelegationError from '../errors/MissingDelegationError'
import { setDelegatedPrivateKey } from '../features/delegation/actions'
import { selectDelegatedClient } from '../features/delegation/selectors'
import getDelegationSaga from './getDelegationSaga'
import getWalletAccountSaga from './getWalletAccountSaga'
import getWalletProviderSaga from './getWalletProviderSaga'
import { encrypt } from '@metamask/eth-sig-util'
import db from '../utils/db'
import MissingDelegatedClientError from '../errors/MissingDelegatedClientError'

export default function* getDelegatedClientSaga() {
    let client: undefined | StreamrClient = yield select(selectDelegatedClient)

    if (!client) {
        const provider: Provider = yield call(getWalletProviderSaga)

        const account: Address = yield call(getWalletAccountSaga)

        try {
            const { encryptedPrivateKey } = yield call(getDelegationSaga, account)

            const payload: string = yield provider.request({
                method: 'eth_decrypt',
                params: [encryptedPrivateKey, account],
            })

            yield put(setDelegatedPrivateKey(JSON.parse(payload).privateKey))
        } catch (e: any) {
            if (!(e instanceof MissingDelegationError)) {
                throw e
            }

            const wallet = Wallet.createRandom()

            const encryptionPublicKey: string = yield provider.request({
                method: 'eth_getEncryptionPublicKey',
                params: [account],
            })

            const now = Date.now()

            yield db.delegations.add({
                owner: account.toLowerCase(),
                createdAt: now,
                updatedAt: now,
                encryptedPrivateKey: Buffer.from(
                    JSON.stringify(
                        encrypt({
                            publicKey: encryptionPublicKey,
                            data: JSON.stringify({
                                privateKey: wallet.privateKey,
                            }),
                            version: 'x25519-xsalsa20-poly1305',
                        })
                    ),
                    'utf8'
                ).toString('hex'),
            })

            yield put(setDelegatedPrivateKey(wallet.privateKey))
        }

        client = yield select(selectDelegatedClient)

        if (!client) {
            throw new MissingDelegatedClientError()
        }
    }

    return client
}
