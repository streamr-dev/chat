import tw from 'twin.macro'
import { useWalletAccount } from '$/features/wallet/hooks'
import Navbar, { NavButton } from './Navbar'
import Text from './Text'
import useDisplayUsername from '$/hooks/useDisplayUsername'
import UserIcon from '$/icons/UserIcon'

interface Props {
    onAccountClick?: () => void
}

export default function Nav({ onAccountClick }: Props) {
    const account = useWalletAccount()

    const name = useDisplayUsername(account)

    return (
        <Navbar>
            <NavButton
                onClick={onAccountClick}
                css={tw`
                    bg-[rgba(255, 255, 255, 0.3)]
                    md:pl-7
                `}
            >
                <UserIcon
                    css={tw`
                        hidden
                        md:block
                        mr-4
                    `}
                    width="18"
                    height="20"
                />
                <div
                    css={tw`
                        max-w-sm
                        min-w-0
                    `}
                >
                    <Text truncate>{name}</Text>
                </div>
            </NavButton>
        </Navbar>
    )
}
