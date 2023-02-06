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
            const account = accounts[0]

            if (!provider || !account) {
                dispatch(WalletAction.setAccount({ account: null }))
                return
            }

            dispatch(WalletAction.setAccount({ account, provider }))
        }

        provider.addListener('accountsChanged', onAccountsChange)

        return () => {
            provider.removeListener('accountsChanged', onAccountsChange)
        }
    }, [provider])
}
