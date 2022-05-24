import tw, { css } from 'twin.macro'
import Text from '../Text'

type Props = {
    className?: string
    timestamp: number
}

function formatDate(timestamp: number) {
    const d = new Date(timestamp)

    const [Y, M, D, h, m, s] = [
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
    ].map((val: number) => `${val < 10 ? '0' : ''}${val}`)

    return `${Y}/${M}/${D} ${h}:${m}:${s}`
}

export default function DateTooltip({ timestamp }: Props) {
    return (
        <div
            css={[
                css`
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05),
                        0 1px 3px rgba(0, 0, 0, 0.1);
                    line-height: normal;
                    transition: 0.2s;
                    transition-property: visibility, opacity;
                    transition-delay: 0.2s, 0s;
                `,
                tw`
                    rounded-xl
                    bg-white
                    bottom-full
                    text-[#323232]
                    text-[0.625rem]
                    left-1/2
                    mb-1
                    opacity-0
                    pointer-events-none
                    absolute
                    -translate-x-1/2
                    select-none
                    invisible
                    whitespace-nowrap
                `,
            ]}
        >
            <div
                css={[
                    css`
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05),
                            0 1px 3px rgba(0, 0, 0, 0.1);
                    `,
                    tw`
                        bg-white
                        rounded-sm
                        -bottom-1.5
                        h-3
                        left-1/2
                        absolute
                        rotate-45
                        -translate-x-1/2
                        w-3
                    `,
                ]}
            />
            <div
                css={[
                    tw`
                        bg-white
                        rounded-xl
                        px-3
                        py-2
                        relative
                    `,
                ]}
            >
                <Text>{formatDate(timestamp)}</Text>
            </div>
        </div>
    )
}
