import Text from '$/components/Text'
import { ButtonHTMLAttributes, HTMLAttributes } from 'react'
import tw from 'twin.macro'

export default function ButtonGroup(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            css={[
                tw`
                    bg-[#F1F4F7]
                    flex
                    h-10
                    items-center
                    justify-center
                    mb-4
                    p-1
                    rounded-full
                    w-max

                    [button + button]:ml-1
                `,
            ]}
        />
    )
}

type GroupedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
}

export function GroupedButton({
    type = 'button',
    children,
    active = false,
    ...props
}: GroupedButtonProps) {
    return (
        <button
            {...props}
            type={type}
            css={[
                tw`
                    appearance-none
                    bg-none
                    block
                    font-medium
                    h-8
                    px-4
                    rounded-full
                    text-[#36404E]
                    text-[0.75rem]
                    text-center
                `,
                active &&
                    tw`
                        bg-white
                    `,
            ]}
        >
            <Text>{children}</Text>
        </button>
    )
}
