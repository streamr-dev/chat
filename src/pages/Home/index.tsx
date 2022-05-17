import tw, { css } from 'twin.macro'
import Helmet from 'react-helmet'
import Background from './background.png'
import Button from '../../components/Button'
import Text from '../../components/Text'
import Navbar, { NavButton } from '../../components/Navbar'
import useCurrentAccount from '../../hooks/useCurrentAccount'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import WalletModal from './WalletModal'

function UnwrappedHome() {
    const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false)

    return (
        <>
            <Helmet title="Streamr Chat dApp" />
            <main
                css={[
                    css`
                        background-image: url('${Background}');
                    `,
                    tw`
                        bg-center
                        bg-cover
                        bg-fixed
                        bg-no-repeat
                        h-screen
                        justify-center
                        w-screen
                    `,
                ]}
            >
                <Navbar>
                    <NavButton
                        onClick={() => void setWalletModalOpen(true)}
                        css={[
                            tw`
                                h-full
                                px-[30px]
                                py-[10px]
                                text-[#ff5924]
                                text-[15px]
                                hover:bg-[#fefefe]
                                active:bg-[#f7f7f7]
                            `,
                        ]}
                    >
                        Connect a wallet
                    </NavButton>
                </Navbar>
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
                        <Button
                            css={[
                                tw`
                                    bg-[#ff5924]
                                    font-karelia
                                    h-auto
                                    inline-flex
                                    items-center
                                    px-12
                                    py-6
                                    rounded-[6.25rem]
                                    shadow-lg
                                    text-[#ffffff]
                                    text-[22px]
                                    hover:bg-[#ff6430]
                                    active:bg-[#de4716]
                                `,
                            ]}
                            type="button"
                            onClick={() => {}}
                        >
                            <div
                                css={[
                                    tw`
                                        mr-4
                                        translate-y-[-0.1em]
                                    `,
                                ]}
                            >
                                Create new room
                            </div>
                            <svg
                                css={[
                                    tw`
                                        block
                                    `,
                                ]}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 20C9.741 20 9.49261 19.8971 9.30947 19.714C9.12632 19.5308 9.02344 19.2824 9.02344 19.0234V0.976562C9.02344 0.717562 9.12632 0.46917 9.30947 0.286029C9.49261 0.102888 9.741 0 10 0C10.259 0 10.5074 0.102888 10.6905 0.286029C10.8737 0.46917 10.9766 0.717562 10.9766 0.976562V19.0234C10.9766 19.2824 10.8737 19.5308 10.6905 19.714C10.5074 19.8971 10.259 20 10 20Z"
                                    fill="white"
                                />
                                <path
                                    d="M19.0234 10.9766H0.976562C0.717562 10.9766 0.46917 10.8737 0.286029 10.6905C0.102888 10.5074 0 10.259 0 10C0 9.741 0.102888 9.49261 0.286029 9.30947C0.46917 9.12632 0.717562 9.02344 0.976562 9.02344H19.0234C19.2824 9.02344 19.5308 9.12632 19.714 9.30947C19.8971 9.49261 20 9.741 20 10C20 10.259 19.8971 10.5074 19.714 10.6905C19.5308 10.8737 19.2824 10.9766 19.0234 10.9766Z"
                                    fill="white"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
                <div
                    css={[
                        tw`
                            -translate-x-1/2
                            absolute
                            bg-[#ffffff]
                            bottom-5
                            left-1/2
                            px-5
                            py-[10px]
                            rounded-[50px]
                            text-center
                            text-plug
                            w-[90%]
                            shadow-sm
                            md:left-5
                            md:text-left
                            md:translate-x-0
                            md:w-auto
                        `,
                    ]}
                >
                    <Text>
                        Decentralised, encrypted chat powered by&nbsp;
                        <a
                            css={[
                                tw`
                                    !text-[#ff5924]
                                `,
                            ]}
                            href="https://streamr.network"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Streamr
                        </a>
                    </Text>
                </div>
            </main>
            <WalletModal open={walletModalOpen} setOpen={setWalletModalOpen} />
        </>
    )
}

export default function Home() {
    const account = useCurrentAccount()

    const navigate = useNavigate()

    useEffect(() => {
        if (account) {
            navigate('/chat')
        }
    }, [navigate, account])

    return <UnwrappedHome />
}
