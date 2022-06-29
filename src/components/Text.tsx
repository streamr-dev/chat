import { HTMLAttributes } from 'react'
import tw from 'twin.macro'

type Props = HTMLAttributes<HTMLSpanElement> & {
    truncate?: boolean
}

export default function Text({ truncate = false, ...props }: Props) {
    return (
        <span
            {...props}
            css={[
                tw`
                    block
                    translate-y-[-0.06em]
                `,
                truncate && tw`truncate`,
            ]}
        />
    )
}
