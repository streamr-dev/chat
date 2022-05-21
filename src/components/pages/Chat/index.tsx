import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from '../../../features/wallet'
import Page from '../../Page'
import WalletModal from '../../WalletModal'
import AccountModal from './AccountModal'
import Nav from './Nav'

function UnwrappedChat() {
    const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false)

    const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false)

    function toggleWalletModal(state: boolean) {
        setWalletModalOpen(state)

        if (state === false) {
            setAccountModalOpen(true)
        }
    }

    return (
        <>
            <Page>
                <Nav onAccountClick={() => void setAccountModalOpen(true)} />
            </Page>
            <AccountModal
                open={accountModalOpen}
                setOpen={setAccountModalOpen}
                onChangeClick={() => {
                    setAccountModalOpen(false)
                    setWalletModalOpen(true)
                }}
            />
            <WalletModal open={walletModalOpen} setOpen={toggleWalletModal} />
        </>
    )
}

export default function Chat() {
    const account = useAccount()

    const navigate = useNavigate()

    useEffect(() => {
        if (account === null) {
            navigate('/')
        }
    }, [navigate, account])

    // No account? Render nothing and wait. The above `useEffect` will
    // take us places.
    if (!account) {
        return null
    }

    return <UnwrappedChat />
}
