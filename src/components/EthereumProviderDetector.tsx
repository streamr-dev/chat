import detectEthereumProvider from '@metamask/detect-provider'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ActionType, useDispatch } from '../components/Store'

export default function EthereumProviderDetector() {
    const dispatch = useDispatch()

    useEffect(() => {
        let mounted = true

        async function detect() {
            try {
                if (!window.ethereum) {
                    throw new Error('Ethereum provider could not be detected.')
                }
                const provider =
                    (await detectEthereumProvider()) as MetaMaskInpageProvider

                if (!mounted) {
                    return
                }

                dispatch({
                    type: ActionType.SetEthereumProvider,
                    payload: provider,
                })
            } catch (e: any) {
                console.warn(e)
                toast.error(e.message, {
                    position: 'top-center',
                    autoClose: false,
                })
            }
        }

        detect()

        return () => {
            mounted = false
        }
    }, [dispatch])

    return null
}
