import { Buffer } from 'buffer'
import { Wallet } from 'ethers'
import { useEffect } from 'react'
import { StorageKey } from '../utils/types'
import { useDispatch, useStore, ActionType } from './Store'
import { encrypt } from '@metamask/eth-sig-util'
import useEnsureCorrectNetwork from '../hooks/useEnsureCorrectNetwork'

class NewWalletRequiredError extends Error {}

export default function SessionHandler() {
    const { account, ethereumProvider } = useStore()

    const dispatch = useDispatch()

    const ensureCorrectNetwork = useEnsureCorrectNetwork()
    useEffect(() => {
        if (!ethereumProvider || !account || !ensureCorrectNetwork) {
            return
        }

        async function fn() {
            const encryptedPrivateKey =
                localStorage.getItem(StorageKey.EncryptedSession) || undefined

            try {
                // trigger the network adder/switcher
                await ensureCorrectNetwork()
                try {
                    if (!encryptedPrivateKey) {
                        // No encrypted private key means there's nothing to retrieve. We gotta get
                        // the user a new delegation wallet.
                        throw new NewWalletRequiredError()
                    }

                    try {
                        const decrypted = await ethereumProvider!.request({
                            method: 'eth_decrypt',
                            params: [encryptedPrivateKey, account],
                        })

                        dispatch({
                            type: ActionType.SetSession,
                            payload: JSON.parse(decrypted as string).privateKey,
                        })
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

                    const encryptionPublicKey = await ethereumProvider!.request(
                        {
                            method: 'eth_getEncryptionPublicKey',
                            params: [account!],
                        }
                    )

                    localStorage.setItem(
                        StorageKey.EncryptedSession,
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
            } catch (e) {
                dispatch({
                    type: ActionType.Reset,
                })

                console.error(e)
            }
        }

        fn()
    }, [ethereumProvider, account, dispatch, ensureCorrectNetwork])

    return null
}
