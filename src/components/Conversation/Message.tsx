import { HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'
import { IMessage } from '../../features/messages/types'
import Avatar from '../Avatar'
import Text from '../Text'
import DateTooltip from './DateTooltip'

type Props = HTMLAttributes<HTMLDivElement> & {
    payload: IMessage
    incoming?: boolean
}

export default function Message({
    payload,
    incoming = false,
    ...props
}: Props) {
    const { createdBy, createdAt, content } = payload

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
            {incoming && <Avatar account={createdBy} tw="mr-4" />}
            <div
                css={[
                    css`
                        flex: 0 1 auto;

                        :hover div:first-of-type {
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
                <Text>{content}</Text>
            </div>
            {!incoming && <Avatar account={createdBy} tw="ml-4" />}
        </div>
    )
}
