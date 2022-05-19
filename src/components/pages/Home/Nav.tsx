import tw from 'twin.macro'
import Navbar, { NavButton } from '../../Navbar'
import Text from '../../Text'

type Props = {
    onConnectClick?: () => void
}

export default function Nav({ onConnectClick }: Props) {
    return (
        <Navbar>
            <NavButton
                onClick={onConnectClick}
                css={[
                    tw`
                        text-[#ff5924]
                        hover:bg-[#fefefe]
                        active:bg-[#f7f7f7]
                    `,
                ]}
            >
                <Text>Connect a wallet</Text>
            </NavButton>
        </Navbar>
    )
}
