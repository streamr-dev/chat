import ChatPage from '$/components/ChatPage'
import HomePage from '$/components/HomePage'
import { useDelegatedAccount } from '$/features/delegation/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useEagerConnectEffect from '$/hooks/useEagerConnectEffect'

export default function IndexPage() {
    const account = useWalletAccount()

    const delegatedAccount = useDelegatedAccount()

    useEagerConnectEffect()

    if (!account || !delegatedAccount) {
        return <HomePage />
    }

    return <ChatPage />
}
