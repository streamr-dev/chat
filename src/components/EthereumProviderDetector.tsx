import detectEthereumProvider from '@metamask/detect-provider'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { useEffect } from 'react'
import { ActionType, useDispatch } from '../components/Store'

export default function EthereumProviderDetector() {
    const dispatch = useDispatch()

    useEffect(() => {
        let mounted = true

        async function detect() {
            try {
                const provider =
                    (await detectEthereumProvider()) as MetaMaskInpageProvider

                if (!mounted) {
                    return
                }

                dispatch({
                    type: ActionType.SetEthereumProvider,
                    payload: provider,
                })
            } catch (e) {
                console.warn('Ethereum provider could not be detected.')
            }
        }

        detect()

        return () => {
            mounted = false
        }
    }, [dispatch])

    return null
}
