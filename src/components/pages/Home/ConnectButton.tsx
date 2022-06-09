import tw from 'twin.macro'
import Button from '../../Button'
import Text from '../../Text'

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export default function CreateRoomButton(props: Props) {
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
