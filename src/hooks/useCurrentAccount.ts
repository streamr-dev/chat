import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectEthereumProvider } from '../features/session'

export default function useCurrentAccount() {
    const ethereumProvider = useSelector(selectEthereumProvider)

    const [account, setAccount] = useState<string | null>()

    useEffect(() => {
        let mounted = true

        async function fn() {
            if (!ethereumProvider) {
                return
            }

            let account

            try {
                account = await ethereumProvider.getAccount()
            } catch (e) {
                // Ignore failures.
            } finally {
                if (!mounted) {
                    return
                }

                // @TODO We need a "change" watcher for this.
                setAccount(account || null)
            }
        }

        fn()

        return () => {
            mounted = false
        }
    }, [ethereumProvider])

    if (!ethereumProvider) {
        return null
    }

    return account
}
