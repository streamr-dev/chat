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

    const [{ provider }, { useAccount }] = getConnector(integrationId)

    const account = useAccount()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!account || !provider) {
            return void dispatch(WalletAction.setAccount())
        }

        dispatch(
            WalletAction.setAccount({
                account,
                provider,
            })
        )
    }, [account, provider, dispatch])
}

export default function IndexPage() {
    useConnectEffect()

    const account = useWalletAccount()

    const navigate = useNavigate()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(MiscAction.setNavigate({ navigate }))
    }, [navigate, dispatch])

    useEffect(() => {
        dispatch(WalletAction.connectEagerly())
    }, [dispatch])

    if (!account) {
        return <HomePage />
    }

    return <ChatPage />
}
