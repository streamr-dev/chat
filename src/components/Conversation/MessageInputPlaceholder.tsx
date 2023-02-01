import { ReactNode } from 'react'
import tw from 'twin.macro'
import Text from '../Text'

interface Props {
    cta?: ReactNode
    children?: ReactNode
}

export default function MessageInputPlaceholder({ cta, children }: Props) {
    return (
        <div css={[tw`rounded-xl items-center flex h-12 w-full`]}>
            <div css={tw`text-[#59799C] p-0 pl-5 text-[0.875rem]`}>
                <Text>{children}</Text>
            </div>
            {!!cta && <div css={tw`ml-4`}>{cta}</div>}
        </div>
    )
}
