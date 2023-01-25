import tw from 'twin.macro'
import Page from '$/components/Page'
import Navbar from '$/components/Navbar'
import Button from '$/components/Button'
import Text from '$/components/Text'
import useWalletModal from '$/hooks/useWalletModal'

export default function HomePage() {
    const { open, modal } = useWalletModal()

    return (
        <>
            {modal}
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
                        <ConnectButton onClick={() => void open()} />
                    </div>
                </div>
                <PoweredBy />
            </Page>
        </>
    )
}

type CreateRoomButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

function ConnectButton(props: CreateRoomButtonProps) {
    return (
        <Button
            {...props}
            css={[
                tw`
                    bg-[#ff5924]
                    font-karelia
                    h-auto
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
    )
}
