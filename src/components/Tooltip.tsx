import tw, { css } from 'twin.macro'
import Text from './Text'
import { HTMLAttributes } from 'react'

export enum Placement {
    Right = 'right',
    Top = 'top',
    Left = 'left',
}

type Props = HTMLAttributes<HTMLDivElement> & {
    placement?: Placement
}

export default function Tooltip({ children, placement = Placement.Top, ...props }: Props) {
    return (
        <div
            {...props}
            css={[
                css`
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
                    line-height: normal;
                    transition: 0.2s;
                    transition-property: visibility, opacity;
                    transition-delay: 0.2s, 0s;
                `,
                tw`
                    rounded-lg
                    bg-white
                    text-[#323232]
                    text-[0.625rem]
                    opacity-0
                    pointer-events-none
                    absolute
                    select-none
                    invisible
                    whitespace-nowrap
                `,
                placement === Placement.Top &&
                    tw`
                        bottom-full
                        left-1/2
                        mb-1
                        -translate-x-1/2
                    `,
                placement === Placement.Right &&
                    tw`
                        top-1/2
                        -translate-y-1/2
                        left-full
                        ml-2
                    `,
                placement === Placement.Left &&
                    tw`
                        top-1/2
                        -translate-y-1/2
                        right-full
                        mr-2
                    `,
            ]}
        >
            <div
                css={[
                    css`
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
                    `,
                    tw`
                        bg-white
                        rounded-sm
                        h-3
                        absolute
                        rotate-45
                        w-3
                    `,
                    placement === Placement.Top &&
                        tw`
                            -bottom-1.5
                            left-1/2
                            -translate-x-1/2
                            `,
                    placement === Placement.Right &&
                        tw`
                            -left-0.5
                            top-1/2
                            -translate-y-1/2
                        `,
                    placement === Placement.Left &&
                        tw`
                            -right-0.5
                            top-1/2
                            -translate-y-1/2
                        `,
                ]}
            />
            <div
                css={[
                    tw`
                        bg-white
                        rounded-lg
                        px-2
                        py-1.5
                        relative
                    `,
                ]}
            >
                <Text>{children}</Text>
            </div>
        </div>
    )
}
