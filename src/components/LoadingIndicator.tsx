import { HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'

export enum LoadingState {
    Idle = 'idle',
    Busy = 'busy',
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    state?: LoadingState
}

export default function LoadingIndicator({ state = LoadingState.Idle, ...props }: Props) {
    return (
        <div
            {...props}
            css={[
                css`
                    will-change: opacity;
                `,
                tw`
                    w-full
                    h-[1px]
                    bg-transparent
                    opacity-0
                    transition-[opacity 0.3s ease-out]
                    overflow-hidden
                    relative

                    after:content-['']
                    after:block
                    after:h-full
                    after:bg-[#59799C]
                    after:absolute
                    after:animate-[2000ms infinite loadingIndicator]
                    after:w-full
                `,
                state === LoadingState.Busy && tw`opacity-100`,
            ]}
        />
    )
}
