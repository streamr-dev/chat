import { HTMLAttributes } from 'react'
import tw from 'twin.macro'

export default function Hint(props: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            {...props}
            css={[
                tw`
                    text-[#59799C]
                    text-[14px]
                    mt-2
                `,
            ]}
        />
    )
}
