import tw from 'twin.macro'
import Page from '$/components/Page'
import Navbar, { NavButton } from '$/components/Navbar'
import Button from '$/components/Button'
import Text from '$/components/Text'
import TryMetaMask from '$/components/TryMetaMask'
import { ButtonHTMLAttributes, useEffect } from 'react'
import i18n from '$/utils/i18n'
import { WalletAction } from '$/features/wallet'
import { useDispatch } from 'react-redux'
import { MiscAction } from '$/features/misc'
import Credits from '$/components/Credits'

export default function HomePage() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(WalletAction.connectEagerly())
    }, [dispatch])

    return (
        <Page>
            <div css={tw`relative`}>
                <Navbar>
                    <NavButton onClick={() => void dispatch(MiscAction.showHowItWorksModal())}>
                        {i18n('howItWorksModal.title')}
                    </NavButton>
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
                            <Text>{i18n('common.greeting')}</Text>
                        </h1>
                        <ConnectButton
                            onClick={() =>
                                void dispatch(MiscAction.showWalletModal({ showTryMetaMask: true }))
                            }
                        />
                        <TryMetaMask
                            css={tw`
                                justify-center
                                mt-6
                            `}
                        />
                    </div>
                </div>
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
                    <Credits />
                </div>
            </div>
        </Page>
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
            <Text>{i18n('common.connectWalletLabel')}</Text>
        </Button>
    )
}
