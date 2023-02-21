import { ComponentProps, ReactNode } from 'react'
import tw from 'twin.macro'
import { Link, LinkProps } from 'react-router-dom'

interface CommonProps {
    icon?: ReactNode
    active?: boolean
    misc?: ReactNode
}

type Tag = undefined | 'a' | 'button' | typeof Link

type IntristicProps<T> = T extends undefined
    ? never
    : T extends string
    ? T extends 'a'
        ? ComponentProps<'a'>
        : T extends 'button'
        ? Omit<ComponentProps<'button'>, 'type'>
        : never
    : T extends typeof Link
    ? LinkProps
    : never

type Props<T> = { tag?: T } & IntristicProps<T> & CommonProps

export default function SidebarButton<T extends Tag = 'button'>({
    tag: Tag = 'button',
    icon = <FallbackIcon />,
    children,
    active = false,
    misc,
    ...props
}: Props<T>) {
    const rest =
        Tag === 'button'
            ? {
                  ...props,
                  type: 'button',
              }
            : props

    return (
        <Tag
            {...(rest as any)}
            css={[
                tw`
                    outline-none
                    appearance-none
                    rounded-[20px]
                    px-3
                    lg:px-6
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
                active && tw`!bg-white`,
            ]}
        >
            <div
                css={tw`
                    h-12
                    w-12
                    mr-3
                    lg:mr-4
                    shrink-0
                `}
            >
                {icon}
            </div>
            <div
                css={tw`
                    min-w-0
                    grow
                `}
            >
                {children}
            </div>
            <div>{misc}</div>
        </Tag>
    )
}

function FallbackIcon() {
    return <div />
}
