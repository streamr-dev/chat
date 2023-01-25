import { ComponentProps, FC, ForwardedRef, forwardRef, ReactNode } from 'react'
import tw, { css } from 'twin.macro'

type Props<T> = { tag?: T } & (T extends undefined
    ? never
    : T extends string
    ? T extends 'a' | 'button'
        ? ComponentProps<T>
        : never
    : never)

type Forward<T> = T extends undefined
    ? never
    : T extends string
    ? T extends 'a'
        ? HTMLAnchorElement
        : T extends 'button'
        ? HTMLButtonElement
        : never
    : never

type Tag = undefined | 'a' | 'button'

interface BodyProps {
    children?: ReactNode
}

function DefaultBody({ children }: BodyProps) {
    return <>{children}</>
}

export function forge(displayName: string, css?: any, Body: FC<BodyProps> = DefaultBody) {
    function Bare<T extends Tag = 'button'>(
        { tag: Tag = 'button', children, ...props }: Props<T>,
        ref?: ForwardedRef<Forward<T>>
    ) {
        return (
            <Tag {...(props as any)} ref={ref} css={css}>
                <Body>{children}</Body>
            </Tag>
        )
    }

    const Reffed = forwardRef(Bare) as <T extends Tag = 'button'>(props: Props<T>) => JSX.Element

    ;(Reffed as FC).displayName = displayName

    return Reffed
}

const Button = forge('Button', [
    css`
        will-change: transform;
    `,
    tw`
        appearance-none
        bg-[#ffffff]
        border-0
        h-12
        text-[#323232]
        transition-all
        duration-300
        select-none
        hover:translate-y-[-2%]
        active:duration-[50ms]
        active:translate-y-[1%]
        disabled:opacity-50
        disabled:cursor-default
        disabled:translate-y-0
    `,
])

export default Button
