import { LabelHTMLAttributes } from 'react'
import tw from 'twin.macro'

export default function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            {...props}
            css={[
                tw`
                    block
                    text-[14px]
                    text-[#36404E]
                    font-medium
                    mb-2
                `,
            ]}
        />
    )
}
