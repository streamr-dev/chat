import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { WalletAction } from '$/features/wallet'
import { useWalletAccount, useWalletProvider } from '$/features/wallet/hooks'
import isSameAddress from '$/utils/isSameAddress'
import { DelegationAction } from '$/features/delegation'
import { Flag } from '$/features/flag/types'

export default function useProviderChangeEffect() {
    const provider = useWalletProvider()

    const account = useWalletAccount()?.toLowerCase()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!provider || typeof provider.addListener !== 'function') {
            return () => {
                // Noop.
            }
        }

        function onAccountsChange(accounts: string[]) {
            const acc = accounts[0]

            if (!provider || !acc) {
                dispatch(WalletAction.setAccount({ account: null }))
                return
            }

            if (isSameAddress(account, acc)) {
                return
            }

            dispatch(WalletAction.setAccount({ account: acc, provider }))

            dispatch(
                DelegationAction.requestPrivateKey({
                    owner: acc,
                    provider,
                    fingerprint: Flag.isAccessBeingDelegated(acc),
                })
            )
        }

        provider.addListener('accountsChanged', onAccountsChange)

        return () => {
            provider.removeListener('accountsChanged', onAccountsChange)
        }
    }, [provider, account])
}
