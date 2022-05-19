import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useWalletAdapterId } from '../../features/session'

function UnwrappedChat() {
    const account = useAccount()

    return <h1>Chat {account}</h1>
}

export default function Chat() {
    const account = useAccount()

    const walletAdapterId = useWalletAdapterId()

    const navigate = useNavigate()

    const shouldRedirect = account === null || !walletAdapterId

    useEffect(() => {
        if (shouldRedirect) {
            navigate('/')
        }
    }, [navigate, shouldRedirect])

    // No account? Render nothing and wait. The above `useEffect` will
    // take us places.
    if (!account) {
        return null
    }

    return <UnwrappedChat />
}
