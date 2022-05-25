import { HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'
import getIdenticon from '../getters/getIdenticon'

type Props = HTMLAttributes<HTMLDivElement> & {
    account: string
}

export default function Avatar({ account, ...props }: Props) {
    return (
        <div
            {...props}
            css={[
                css`
                    box-shadow: 0 0 3px rgba(0, 0, 0, 0.05),
                        0 1px 1px rgba(0, 0, 0, 0.1);
                `,
                tw`
                    bg-white
                    rounded-full
                    overflow-hidden
                    flex-shrink-0
                    w-10
                    h-10
                    p-2
                `,
            ]}
        >
            <img
                css={[
                    tw`
                        bg-[#f1f4f7]
                        bg-white
                        block
                        w-full
                        h-full
                    `,
                ]}
                src={`data:image/png;base64,${getIdenticon(account)}`}
                alt={account}
            />
        </div>
    )
}
