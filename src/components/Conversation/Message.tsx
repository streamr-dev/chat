import { AnchorHTMLAttributes, Fragment, HTMLAttributes, ReactNode, useState } from 'react'
import tw, { css } from 'twin.macro'
import { IMessage } from '$/features/message/types'
import Avatar, { AvatarStatus, Wrap } from '../Avatar'
import Text from '../Text'
import DateTooltip from './DateTooltip'
import { useWalletAccount } from '$/features/wallet/hooks'
import useSeenMessageEffect from '$/hooks/useSeenMessageEffect'

type Props = HTMLAttributes<HTMLDivElement> & {
    payload: IMessage
    incoming?: boolean
    hideAvatar?: boolean
}

function formatMessage(message: string): ReactNode {
    const chunks = message.split(' ')

    return (
        <>
            {chunks.map((chunk, i) => {
                return (
                    <Fragment key={i}>
                        {/^https?:\/\/\S+$/.test(chunk) ? <Link href={chunk}>{chunk}</Link> : chunk}
                        {i !== chunks.length - 1 && ' '}
                    </Fragment>
                )
            })}
        </>
    )
}

export default function Message({
    payload,
    incoming = false,
    hideAvatar = false,
    ...props
}: Props) {
    const { createdBy, createdAt, content, seenAt, roomId, id } = payload

    const isSeen = Boolean(seenAt)

    const requester = useWalletAccount()

    const [element, setElement] = useState<null | HTMLDivElement>(null)

    useSeenMessageEffect(element, id, roomId, requester, { skip: isSeen })

    const avatar = hideAvatar ? (
        <Wrap />
    ) : (
        <Avatar status={AvatarStatus.Offline} seed={createdBy.toLowerCase()} />
    )

    return (
        <div
            {...props}
            ref={setElement}
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
                            transition-delay: 0.25s;
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
                {incoming && (
                    <div
                        css={[
                            tw`
                                w-1.5
                                h-1.5
                                absolute
                                top-1/2
                                translate-x-full
                                -translate-y-1/2
                                -right-2
                            `,
                        ]}
                    >
                        <div
                            css={[
                                tw`
                                    w-full
                                    h-full
                                    rounded-full
                                    bg-[#59799C]
                                `,
                                Boolean(isSeen) &&
                                    css`
                                        opacity: 0;
                                        transform: scale(0.1);
                                        visibility: hidden;
                                        transition: 300ms ease-in;
                                        transition-property: visibility, opacity, transform;
                                        transition-delay: 300ms, 0s, 0s;
                                    `,
                            ]}
                        />
                    </div>
                )}
                <DateTooltip timestamp={createdAt} />
                <Text>{formatMessage(content)}</Text>
            </div>
            {!incoming && <div tw="ml-4 flex-shrink-0">{avatar}</div>}
        </div>
    )
}

function Link(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>) {
    return (
        <a
            {...props}
            target="_blank"
            rel="noreferrer noopener"
            css={[
                tw`
                    underline
                `,
            ]}
        />
    )
}
