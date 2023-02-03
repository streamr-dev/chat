import { HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'

interface Props extends HTMLAttributes<HTMLDivElement> {
    color?: string
    r?: number
}

export default function Dot({ color = '#59799c', r = 2, ...props }: Props) {
    return (
        <div
            {...props}
            css={[
                css`
                    background-color: ${color};
                    width: ${r * 2}px;
                    height: ${r * 2}px;
                `,
                tw`
                    rounded-full
                `,
            ]}
        />
    )
}
