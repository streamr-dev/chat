import ChatPage from '$/components/ChatPage'
import HomePage from '$/components/HomePage'
import { useWalletAccount } from '$/features/wallet/hooks'

export default function IndexPage() {
    const account = useWalletAccount()

    if (!account) {
        return <HomePage />
    }

    return <ChatPage />
}
