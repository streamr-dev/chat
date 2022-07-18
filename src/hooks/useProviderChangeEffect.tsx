import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { WalletAction } from '$/features/wallet'
import { useWalletAccount, useWalletProvider } from '$/features/wallet/hooks'
import isSameAddress from '$/utils/isSameAddress'

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
            if (!isSameAddress(account, accounts[0])) {
                dispatch(WalletAction.setAccount(accounts[0]))
            }
        }

        provider.addListener('accountsChanged', onAccountsChange)

        return () => {
            provider.removeListener('accountsChanged', onAccountsChange)
        }
    }, [provider, account])
}
