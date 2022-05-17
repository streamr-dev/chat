import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { WalletAdapter } from '../../types/common'
import { setEthereumProvider, useWalletAdapterId } from '../features/session'

type Props = {
    walletAdapter: WalletAdapter
}

export default function WalletAdapterObserver({ walletAdapter }: Props) {
    const connector = walletAdapter.getConnector()

    const [, hooks] = connector

    const isActive = hooks.useIsActive()

    const provider = hooks.useProvider()

    const wasActiveRef = useRef<boolean>(false)

    useEffect(() => {
        wasActiveRef.current = !isActive
    }, [isActive])

    const dispatch = useDispatch()

    useEffect(() => {
        if (!isActive && !wasActiveRef.current) {
            return
        }

        dispatch(setEthereumProvider(provider))
    }, [isActive, provider, dispatch])

    useWalletAdapterEffect(walletAdapter)

    return null
}

function useWalletAdapterEffect(walletAdapter: WalletAdapter) {
    const walletAdapterIdRef = useRef(useWalletAdapterId())

    useEffect(() => {
        if (walletAdapterIdRef.current !== walletAdapter.id) {
            return
        }

        const [adapter] = walletAdapter.getConnector()

        adapter.connectEagerly()
    }, [walletAdapter])
}
