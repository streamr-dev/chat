import { HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'

interface Props extends HTMLAttributes<HTMLDivElement> {
    color?: string
    size?: number
}

export default function Dot({ color = '#59799c', size = 4, ...props }: Props) {
    return (
        <div
            {...props}
            css={[
                css`
                    background-color: ${color};
                    width: ${size}px;
                    height: ${size}px;
                `,
                tw`
                    rounded-full
                `,
            ]}
        />
    )
}
