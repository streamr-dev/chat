import { HTMLAttributes, ReactNode } from 'react'
import Text from './Text'
import tw from 'twin.macro'

type Props = HTMLAttributes<HTMLDivElement> & {
    icon?: ReactNode
}

export default function Tag({ icon, children, ...props }: Props) {
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
                    flex
                    items-center
                `,
            ]}
        >
            {!!icon && (
                <div
                    css={[
                        tw`
                            mr-1
                        `,
                    ]}
                >
                    {icon}
                </div>
            )}
            <div>
                <Text>{children}</Text>
            </div>
        </div>
    )
}
