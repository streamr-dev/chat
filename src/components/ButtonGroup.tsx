import Text from '$/components/Text'
import { ButtonHTMLAttributes, HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'

export default function ButtonGroup(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            css={[
                css`
                    button:first-of-type {
                        border-top-left-radius: 0.5rem;
                        border-bottom-left-radius: 0.5rem;
                    }
                    button:last-of-type {
                        border-top-right-radius: 0.5rem;
                        border-bottom-right-radius: 0.5rem;
                    }
                `,
                tw`
                    flex
                    items-center
                    justify-center
                    mb-4
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
                    text-center
                    bg-[#F7F9FC]
                    text-[0.875rem]
                    h-8
                    text-[#59799C]
                    block
                    px-4
                `,
                active &&
                    tw`
                        bg-[#E0E7F2]
                        text-[black]
                        shadow-[inset 0 1px 1px rgba(0, 0, 0, 0.05)]
                    `,
            ]}
        >
            <Text>{children}</Text>
        </button>
    )
}
