import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setEthereumProvider, useWalletAdapterId } from '../features/session'
import { lookup } from '../utils/web3/adapters'
import { initializeConnector } from '@web3-react/core'
// @ts-ignore ts does not see `export Empty`.
import { Empty, EMPTY } from '@web3-react/empty'

let fallbackConnector: any

const fallbackWalletAdapter = {
    getConnector() {
        if (!fallbackConnector) {
            fallbackConnector = initializeConnector<Empty>(() => EMPTY)
        }

        return fallbackConnector
    },
}

export default function WalletObserver() {
    const walletAdapterId = useWalletAdapterId()

    const walletAdapter = lookup(walletAdapterId) || fallbackWalletAdapter

    const [adapter, hooks] = walletAdapter.getConnector()

    const adapterRef = useRef(adapter)

    useEffect(() => {
        if (typeof (adapterRef.current || {}).connectEagerly === 'function') {
            adapterRef.current.connectEagerly()
        }
    }, [])

    const isActive = hooks.useIsActive()

    const provider = hooks.useProvider()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setEthereumProvider(provider))
    }, [dispatch, provider, isActive])

    return null
}
