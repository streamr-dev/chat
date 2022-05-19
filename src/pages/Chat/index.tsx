import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useWalletAdapterId } from '../../features/session'
import Navbar, { NavButton } from '../../components/Navbar'
import trunc from '../../utils/trunc'
import Page from '../../components/Page'
import tw from 'twin.macro'
import Text from '../../components/Text'

function UnwrappedChat() {
    const account = useAccount()

    return (
        <>
            <Page>
                <Navbar>
                    <NavButton
                        css={[
                            tw`
                                bg-[rgba(255, 255, 255, 0.3)]
                            `,
                        ]}
                    >
                        <div
                            css={[
                                tw`
                                    mr-4
                                `,
                            ]}
                        >
                            <svg
                                css={[
                                    tw`
                                        block
                                    `,
                                ]}
                                width="18"
                                height="20"
                                viewBox="0 0 18 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9 2.66668C6.97496 2.66668 5.33333 4.3083 5.33333 6.33334C5.33333 8.35839 6.97496 10 9 10C11.025 10 12.6667 8.35839 12.6667 6.33334C12.6667 4.3083 11.025 2.66668 9 2.66668ZM3.5 6.33334C3.5 3.29578 5.96243 0.833344 9 0.833344C12.0376 0.833344 14.5 3.29578 14.5 6.33334C14.5 9.37091 12.0376 11.8333 9 11.8333C5.96243 11.8333 3.5 9.37091 3.5 6.33334ZM5.33333 15.5C3.81455 15.5 2.58333 16.7312 2.58333 18.25C2.58333 18.7563 2.17293 19.1667 1.66667 19.1667C1.16041 19.1667 0.75 18.7563 0.75 18.25C0.75 15.7187 2.80203 13.6667 5.33333 13.6667H12.6667C15.198 13.6667 17.25 15.7187 17.25 18.25C17.25 18.7563 16.8396 19.1667 16.3333 19.1667C15.8271 19.1667 15.4167 18.7563 15.4167 18.25C15.4167 16.7312 14.1854 15.5 12.6667 15.5H5.33333Z"
                                    fill="#0D0D0D"
                                />
                            </svg>
                        </div>
                        <div>
                            <Text>{trunc(account)}</Text>
                        </div>
                    </NavButton>
                </Navbar>
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
