import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useCurrentAccount from '../../hooks/useCurrentAccount'

function UnwrappedChat() {
    return <h1>Chat</h1>
}

export default function Chat() {
    const account = useCurrentAccount()

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
