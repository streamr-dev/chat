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
                    bg-[#E0E7F2]
                    text-[0.5rem]
                    font-medium
                    tracking-wider
                    uppercase
                    px-1.5
                    py-0.5
                    w-max
                    rounded-sm
                    shadow-sm
                `,
            ]}
        >
            <Text>{children}</Text>
        </div>
    )
}
