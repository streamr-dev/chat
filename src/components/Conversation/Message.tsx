import { HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'
import Avatar from '../Avatar'
import Text from '../Text'
import DateTooltip from './DateTooltip'

type Props = HTMLAttributes<HTMLDivElement> & {
    sender: string
    createdAt: number
    incoming?: boolean
}

export default function Message({
    sender,
    createdAt,
    children,
    incoming = false,
    ...props
}: Props) {
    return (
        <div
            {...props}
            css={[
                tw`
                    flex
                `,
                !incoming &&
                    tw`
                        justify-end
                    `,
            ]}
        >
            {incoming && <Avatar account={sender} tw="mr-4" />}
            <div
                css={[
                    css`
                        flex: 0 1 auto;

                        :hover :first-child {
                            opacity: 1;
                            visibility: visible;
                            transition-delay: 1s, 1s;
                        }
                    `,
                    tw`
                        bg-[#F1F4F7]
                        rounded-xl
                        text-[0.875rem]
                        leading-7
                        max-w-full
                        min-w-0
                        px-4
                        py-1.5
                        relative
                        break-words
                    `,
                    !incoming &&
                        tw`
                            bg-[#615ef0]
                            text-white
                        `,
                ]}
            >
                <DateTooltip timestamp={createdAt} />
                <Text>{children}</Text>
            </div>
            {!incoming && <Avatar account={sender} tw="ml-4" />}
        </div>
    )
}
