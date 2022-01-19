import { Buffer } from 'buffer'
import { Wallet } from 'ethers'
import { useEffect } from 'react'
import { StorageKey } from '../utils/types'
import { useDispatch, useStore, ActionType } from './Store'
import { encrypt } from '@metamask/eth-sig-util'

class NewWalletRequiredError extends Error {}

export default function SessionHandler() {
    const { account, ethereumProvider } = useStore()

    const dispatch = useDispatch()

    useEffect(() => {
        let mounted = true

        async function fn() {
            const encryptedPrivateKey =
                localStorage.getItem(StorageKey.EncryptedSessionKey) ||
                undefined

            try {
                if (!encryptedPrivateKey) {
                    throw new NewWalletRequiredError()
                }

                try {
                    const decrypted = await ethereumProvider!.request({
                        method: 'eth_decrypt',
                        params: [encryptedPrivateKey, account],
                    })

                    if (!mounted) {
                        return
                    }

                    dispatch({
                        type: ActionType.SetSession,
                        payload: JSON.parse(decrypted as string).privateKey,
                    })
                } catch (e: any) {
                    if (e.code !== 4001) {
                        throw new NewWalletRequiredError()
                    }

                    throw e
                }
            } catch (e: any) {
                if (!(e instanceof NewWalletRequiredError)) {
                    throw e
                }

                const wallet = Wallet.createRandom()

                const encryptionPublicKey = await ethereumProvider!.request({
                    method: 'eth_getEncryptionPublicKey',
                    params: [account!],
                })

                if (!mounted) {
                    return
                }

                localStorage.setItem(
                    StorageKey.EncryptedSessionKey,
                    Buffer.from(
                        JSON.stringify(
                            encrypt({
                                publicKey: encryptionPublicKey as string,
                                data: JSON.stringify({
                                    privateKey: wallet!.privateKey,
                                }),
                                version: 'x25519-xsalsa20-poly1305',
                            })
                        ),
                        'utf8'
                    ).toString('hex')
                )

                dispatch({
                    type: ActionType.SetSession,
                    payload: wallet.privateKey,
                })
            }
        }

        if (ethereumProvider && account) {
            fn()
        }

        return () => {
            mounted = false
        }
    }, [ethereumProvider, account, dispatch])

    return null
}
