import tw from 'twin.macro'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import WalletModal from '../../WalletModal'
import Page from '../../Page'
import PoweredBy from './PoweredBy'
import ConnectButton from './ConnectButton'
import Navbar from '../../Navbar'
import { useWalletAccount } from '../../../features/wallet/hooks'

function UnwrappedHome() {
    const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false)

    return (
        <>
            <Page>
                <Navbar />
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
                        <ConnectButton
                            onClick={() => void setWalletModalOpen(true)}
                        />
                    </div>
                </div>
                <PoweredBy />
            </Page>
            <WalletModal open={walletModalOpen} setOpen={setWalletModalOpen} />
        </>
    )
}

export default function Home() {
    const account = useWalletAccount()

    const navigate = useNavigate()

    useEffect(() => {
        if (account) {
            navigate('/chat')
        }
    }, [navigate, account])

    return <UnwrappedHome />
}
