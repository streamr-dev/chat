import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useWalletAdapterId } from '../../../features/session'
import Page from '../../Page'
import Nav from './Nav'

function UnwrappedChat() {
    return (
        <>
            <Page>
                <Nav />
            </Page>
        </>
    )
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
