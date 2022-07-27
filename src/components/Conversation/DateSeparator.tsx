import Text from '$/components/Text'
import { format } from 'date-fns'
import { HTMLAttributes } from 'react'
import tw from 'twin.macro'

type Props = HTMLAttributes<HTMLDivElement> & { timestamp: number; includeDate: boolean }

export default function DateSeparator({ timestamp, includeDate, ...props }: Props) {
    return (
        <div
            {...props}
            css={[
                tw`
                    text-center
                    text-[0.75rem]
                    font-medium
                    text-[#59799C]
                    my-4
                    opacity-75
                `,
            ]}
        >
            <Text>{format(timestamp, includeDate ? 'LLL do, HH:mm' : 'HH:mm')}</Text>
        </div>
    )
}
