import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { WalletAction } from '$/features/wallet'
import { useWalletProvider } from '$/features/wallet/hooks'

export default function useProviderChangeEffect() {
    const provider = useWalletProvider()

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

            // `setAccount` takes care of consecutive action calls for the same account, and skips
            // redundant processing.
            dispatch(WalletAction.setAccount({ account: acc, provider }))
        }

        provider.addListener('accountsChanged', onAccountsChange)

        return () => {
            provider.removeListener('accountsChanged', onAccountsChange)
        }
    }, [provider])
}
