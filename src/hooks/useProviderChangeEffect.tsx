import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setWalletAccount } from '../features/wallet/actions'
import { useWalletProvider } from '../features/wallet/hooks'

export default function useProviderChangeEffect() {
    const provider = useWalletProvider()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!provider) {
            return () => {
                // Noop.
            }
        }

        function onAccountsChange(accounts: string[]) {
            dispatch(setWalletAccount(accounts[0]))
        }

        provider.addListener('accountsChanged', onAccountsChange)

        return () => {
            provider.removeListener('accountsChanged', onAccountsChange)
        }
    }, [provider])
}
