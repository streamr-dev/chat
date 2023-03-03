import ChatPage from '$/components/ChatPage'
import HomePage from '$/components/HomePage'
import { MiscAction } from '$/features/misc'
import { WalletAction } from '$/features/wallet'
import { useWalletAccount, useWalletIntegrationId } from '$/features/wallet/hooks'
import getConnector from '$/utils/getConnector'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Provider } from '@web3-react/types'

function useConnectEffect() {
    const integrationId = useWalletIntegrationId()

    const [, { useAccount, useProvider }] = getConnector(integrationId)

    const account = useAccount()

    const web3provider = useProvider()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!account || !web3provider || !web3provider.provider) {
            return void dispatch(WalletAction.setAccount())
        }

        dispatch(
            WalletAction.setAccount({
                account,
                provider: web3provider.provider as Provider,
            })
        )
    }, [account, web3provider, dispatch])
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
