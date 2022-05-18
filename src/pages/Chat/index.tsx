import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from '../../features/session'

function UnwrappedChat() {
    return <h1>Chat</h1>
}

export default function Chat() {
    const account = useAccount()

    const navigate = useNavigate()

    useEffect(() => {
        if (account === null) {
            navigate('/')
        }
    }, [navigate, account])

    if (!account) {
        return null
    }

    return <UnwrappedChat />
}
