import tw, { css } from 'twin.macro'

interface Props {
    r?: number
    strokeWidth?: number
    strokeColor?: string
}

export default function Spinner({ r = 6, strokeWidth = 2, strokeColor = '#59799C' }: Props) {
    const d = 2 * Math.PI * r

    return (
        <div
            css={[
                tw`
                    absolute
                    top-1/2
                    left-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    w-8
                    h-8
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
                viewBox="0 0 32 32"
            >
                <circle
                    cx="16"
                    cy="16"
                    r={r}
                    fill="none"
                    strokeWidth={strokeWidth}
                    stroke={strokeColor}
                    strokeLinecap="round"
                    strokeDasharray={`${0.6 * d}, ${0.4 * d}`}
                    strokeDashoffset="0"
                />
            </svg>
        </div>
    )
}
