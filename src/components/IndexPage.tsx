import ChatPage from '$/components/ChatPage'
import HomePage from '$/components/HomePage'
import { MiscAction } from '$/features/misc'
import { useWalletAccount } from '$/features/wallet/hooks'
import useEagerConnectEffect from '$/hooks/useEagerConnectEffect'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function IndexPage() {
    const account = useWalletAccount()

    useEagerConnectEffect()

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
