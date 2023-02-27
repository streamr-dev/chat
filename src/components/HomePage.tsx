import tw from 'twin.macro'
import Page from '$/components/Page'
import Navbar, { NavButton } from '$/components/Navbar'
import Button from '$/components/Button'
import Text from '$/components/Text'
import useWalletModal from '$/hooks/useWalletModal'
import useHowItWorksModal from '$/hooks/useHowItWorksModal'
import TryMetaMask from '$/components/TryMetaMask'
import { ButtonHTMLAttributes } from 'react'

export default function HomePage() {
    const { open, modal } = useWalletModal()

    const { open: openHiwModal, modal: hiwModal } = useHowItWorksModal()

    return (
        <>
            {modal}
            {hiwModal}
            <Page>
                <div css={tw`relative`}>
                    <Navbar>
                        <NavButton onClick={() => void openHiwModal()}>How it works?</NavButton>
                    </Navbar>
                    <div
                        css={[
                            tw`
                                flex
                                flex-col
                                items-center
                                justify-center
                                text-center
                                w-screen
                                h-screen
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
                                        mb-[3rem]
                                        md:mb-[6.25rem]
                                        text-[2.5rem]
                                        md:text-[5rem]
                                        leading-normal
                                    `,
                                ]}
                            >
                                <Text>Hello world.</Text>
                            </h1>
                            <ConnectButton onClick={() => void open()} />
                            <TryMetaMask
                                css={tw`
                                    justify-center
                                    mt-6
                                `}
                            />
                        </div>
                    </div>
                    <PoweredBy />
                </div>
            </Page>
        </>
    )
}

function ConnectButton(props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>) {
    return (
        <Button
            {...props}
            css={[
                tw`
                    bg-[#ff5924]
                    font-karelia
                    h-auto
                    px-9
                    md:px-12
                    py-5
                    md:py-6
                    rounded-[6.25rem]
                    shadow-lg
                    text-[#ffffff]
                    text-[22px]
                    hover:bg-[#ff6430]
                    active:bg-[#de4716]
                `,
            ]}
            type="button"
        >
            <Text>Connect a wallet</Text>
        </Button>
    )
}

function PoweredBy() {
    return (
        <div
            css={[
                tw`
                    -translate-x-1/2
                    absolute
                    bottom-6
                    left-1/2
                    w-full
                    px-6
                    md:px-0
                    md:left-5
                    md:translate-x-0
                    md:w-fit
                `,
            ]}
        >
            <div
                css={tw`
                    bg-white
                    px-5
                    py-2.5
                    rounded-full
                    text-plug
                    shadow-sm
                    text-center
                    md:text-left
                `}
            >
                <Text>
                    Decentralized by&nbsp;
                    <a
                        css={tw`!text-[#ff5924]`}
                        href="https://streamr.network"
                        rel="noreferrer"
                        target="_blank"
                    >
                        Streamr
                    </a>
                </Text>
            </div>
        </div>
    )
}
