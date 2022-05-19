import tw from 'twin.macro'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import WalletModal from './WalletModal'
import { useAccount, useWalletAdapterId } from '../../../features/session'
import Page from '../../Page'
import PoweredBy from './PoweredBy'
import CreateRoomButton from './CreateRoomButton'
import Nav from './Nav'

function UnwrappedHome() {
    const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false)

    return (
        <>
            <Page>
                <Nav onConnectClick={() => void setWalletModalOpen(true)} />
                <div
                    css={[
                        tw`
                            flex
                            flex-col
                            h-screen
                            items-center
                            justify-center
                            text-center
                            w-screen
                        `,
                    ]}
                >
                    <div>
                        <h1
                            css={[
                                tw`
                                    animate-float
                                    font-medium
                                    m-0
                                    mb-[6.25rem]
                                    text-h1
                                `,
                            ]}
                        >
                            Hello world.
                        </h1>
                        <CreateRoomButton />
                    </div>
                </div>
                <PoweredBy />
            </Page>
            <WalletModal open={walletModalOpen} setOpen={setWalletModalOpen} />
        </>
    )
}

export default function Home() {
    const account = useAccount()

    const adapterId = useWalletAdapterId()

    const navigate = useNavigate()

    useEffect(() => {
        if (account) {
            navigate('/chat')
        }
    }, [navigate, account])

    if (typeof account === 'undefined' && adapterId) {
        return null
    }

    return <UnwrappedHome />
}
