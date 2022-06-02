import { HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'
import { IMessage } from '../../features/messages/types'
import useIsOnline from '../../hooks/useIsOnline'
import Avatar, { AvatarStatus, Wrap } from '../Avatar'
import Text from '../Text'
import DateTooltip from './DateTooltip'

type Props = HTMLAttributes<HTMLDivElement> & {
    payload: IMessage
    incoming?: boolean
    hideAvatar?: boolean
}

export default function Message({
    payload,
    incoming = false,
    hideAvatar = false,
    ...props
}: Props) {
    const { createdBy, createdAt, content } = payload

    const status = useIsOnline(createdBy) ? AvatarStatus.Online : AvatarStatus.Offline

    const avatar = hideAvatar ? <Wrap /> : <Avatar status={status} account={createdBy} />

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
            {incoming && <div tw="mr-4 flex-shrink-0">{avatar}</div>}
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
            {!incoming && <div tw="ml-4 flex-shrink-0">{avatar}</div>}
        </div>
    )
}
