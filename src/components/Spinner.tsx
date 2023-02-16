import { HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'

interface Props extends HTMLAttributes<HTMLDivElement> {
    r?: number
    strokeWidth?: number
    strokeColor?: string
    gap?: number
}

export default function Spinner({
    r = 6,
    strokeWidth = 2,
    strokeColor = '#59799C',
    gap = 0.4,
    ...props
}: Props) {
    const d = 2 * Math.PI * r

    const size = (r + strokeWidth) * 2

    return (
        <div
            {...props}
            css={[
                css`
                    width: ${size}px;
                    height: ${size}px;
                `,
                tw`
                    absolute
                    top-1/2
                    left-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    z-10
                `,
            ]}
        >
            <svg
                css={[
                    css`
                        animation: rotate 1s linear infinite;
                    `,
                ]}
                viewBox={`0 0 ${size} ${size}`}
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={strokeWidth}
                    stroke={strokeColor}
                    strokeLinecap="round"
                    strokeDasharray={`${(1 - gap) * d}, ${gap * d}`}
                    strokeDashoffset="0"
                />
            </svg>
        </div>
    )
}
