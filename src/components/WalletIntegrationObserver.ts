import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { WalletAction } from '$/features/wallet'
import { useWalletIntegrationId } from '$/features/wallet/hooks'
import getConnector from '$/utils/getConnector'

export default function WalletIntegrationObserver() {
    const integrationId = useWalletIntegrationId()

    const dispatch = useDispatch()

    const [, hooks] = getConnector(integrationId)

    const isActive = hooks.useIsActive()

    useEffect(() => {
        const newProvider = isActive ? getConnector(integrationId)[0].provider : undefined

        dispatch(WalletAction.setProvider(newProvider))
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
