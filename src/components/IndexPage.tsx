import ChatPage from '$/components/ChatPage'
import HomePage from '$/components/HomePage'
import { MiscAction } from '$/features/misc'
import { WalletAction } from '$/features/wallet'
import { useWalletAccount, useWalletIntegrationId } from '$/features/wallet/hooks'
import getConnector from '$/utils/getConnector'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function useConnectEffect() {
    const integrationId = useWalletIntegrationId()

    const [, { useAccount }] = getConnector(integrationId)

    const account = useAccount()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(WalletAction.setAccount(account))
    }, [account, dispatch])
}

export default function IndexPage() {
    useConnectEffect()

    const account = useWalletAccount()

    const navigate = useNavigate()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(MiscAction.setNavigate({ navigate }))
    }, [navigate, dispatch])

    if (!account) {
        return <HomePage />
    }

    return <ChatPage />
}
