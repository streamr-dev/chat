import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setAccount, useEthereumProvider } from '../features/session'
import getDefaultWeb3Account from '../utils/getDefaultWeb3Account'

export default function AccountWatcher() {
    const ethereumProvider = useEthereumProvider()

    const dispatch = useDispatch()

    useEffect(() => {
        let mounted = true

        let timeout: number | undefined

        async function check() {
            const account = await getDefaultWeb3Account(ethereumProvider)

            if (!mounted) {
                return
            }

            dispatch(setAccount(account))

            if (ethereumProvider) {
                timeout = window.setTimeout(check, 1000)
            }
        }

        check()

        return () => {
            clearTimeout(timeout)
            timeout = undefined
            mounted = false
        }
    }, [ethereumProvider])

    return null
}
