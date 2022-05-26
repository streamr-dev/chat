import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setWalletProvider } from '../features/wallet/actions'
import { useWalletIntegrationId } from '../features/wallet/hooks'
import getConnector from '../utils/getConnector'

export default function WalletIntegrationObserver() {
    const integrationId = useWalletIntegrationId()

    const dispatch = useDispatch()

    const [, hooks] = getConnector(integrationId)

    const isActive = hooks.useIsActive()

    useEffect(() => {
        dispatch(
            setWalletProvider(
                isActive ? getConnector(integrationId)[0].provider : undefined
            )
        )
    }, [integrationId, isActive])

    const integrationIdRef = useRef(integrationId)

    useEffect(() => {
        const [connector] = getConnector(integrationIdRef.current)

        if (typeof connector.connectEagerly === 'function') {
            connector.connectEagerly()
        }
    }, [])

    return null
}
