import { HTMLAttributes } from 'react'
import Text from './Text'
import tw from 'twin.macro'

export default function Tag({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            css={[
                tw`
                    text-[#59799C]
                    bg-[#F7F9FC]
                    text-[0.5rem]
                    font-medium
                    tracking-wider
                    uppercase
                    px-1.5
                    py-0.5
                    w-max
                    rounded-sm
                    shadow-sm
                    select-none
                `,
            ]}
        >
            <Text>{children}</Text>
        </div>
    )
}
