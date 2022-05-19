import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setAccount, useEthereumProvider } from '../features/session'
import getDefaultWeb3Account from '../utils/getDefaultWeb3Account'

export default function AccountWatcher() {
    const ethereumProvider = useEthereumProvider()

    const dispatch = useDispatch()

    const timeoutRef = useRef<number | undefined>()

    useEffect(() => {
        let mounted = true

        async function check() {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = undefined
            }

            const account = await getDefaultWeb3Account(ethereumProvider)

            if (!mounted) {
                return
            }

            dispatch(setAccount(account))

            if (ethereumProvider) {
                timeoutRef.current = window.setTimeout(check, 1000)
            }
        }

        check()

        return () => {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = undefined
            mounted = false
        }
    }, [ethereumProvider])

    return null
}
