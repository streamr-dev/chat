import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useEthereumProvider } from '../features/session'

export default function useCurrentAccount() {
    const ethereumProvider = useEthereumProvider()

    const [account, setAccount] = useState<string | null>()

    useEffect(() => {
        let mounted = true

        let accounts: string[]

        async function fn() {
            try {
                accounts = await ethereumProvider.listAccounts()
            } catch (e) {
                console.warn(e)
            }

            if (!mounted) {
                return
            }

            if (!Array.isArray(accounts)) {
                accounts = []
            }

            // @TODO We need a "change" watcher for this.
            setAccount(accounts[0] || null)
        }

        if (ethereumProvider) {
            fn()
        }

        return () => {
            mounted = false
        }
    }, [ethereumProvider])

    if (!ethereumProvider) {
        return null
    }

    return account
}
