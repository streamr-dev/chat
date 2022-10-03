import { WalletAction } from '$/features/wallet'
import { useWalletIntegrationId } from '$/features/wallet/hooks'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

export default function useEagerConnectEffect() {
    const integrationId = useWalletIntegrationId()

    const integrationIdRef = useRef(integrationId)

    const dispatch = useDispatch()

    useEffect(() => {
        integrationIdRef.current = integrationId
    }, [integrationId])

    useEffect(() => {
        if (!integrationIdRef.current) {
            return
        }

        dispatch(WalletAction.connect({ integrationId: integrationIdRef.current, eager: true }))
    }, [])
}
