import { ButtonHTMLAttributes, ReactNode } from 'react'
import tw from 'twin.macro'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    icon?: ReactNode
    active?: boolean
    misc?: ReactNode
}

export default function SidebarButton({
    icon = <FallbackIcon />,
    children,
    active = false,
    misc,
    ...props
}: Props) {
    return (
        <button
            {...props}
            type="button"
            css={[
                tw`
                    outline-none
                    appearance-none
                    h-[92px]
                    rounded-[20px]
                    p-6
                    bg-[rgba(255, 255, 255, 0.3)]
                    text-left
                    w-full
                    flex
                    items-center
                    transition-colors
                    select-none
                    relative
                    hover:bg-[rgba(255, 255, 255, 0.85)]
                `,
                active &&
                    tw`
                        !bg-white
                    `,
            ]}
        >
            <div
                css={[
                    tw`
                        h-12
                        w-12
                        mr-4
                        flex-shrink-0
                    `,
                ]}
            >
                {icon}
            </div>
            <div
                css={[
                    tw`
                        min-w-0
                        flex-grow
                    `,
                ]}
            >
                {children}
            </div>
            <div>{misc}</div>
        </button>
    )
}

function FallbackIcon() {
    return <div />
}
