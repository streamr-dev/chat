import { Fragment, HTMLAttributes, useEffect, useLayoutEffect, useRef } from 'react'
import tw from 'twin.macro'
import { IMessage, IResend } from '$/features/message/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import isSameAddress from '$/utils/isSameAddress'
import Message from './Message'
import { useSelectedRoomId } from '$/features/room/hooks'
import MessageGroupLabel from '$/components/Conversation/MessageGroupLabel'
import Text from '$/components/Text'
import useMessageGroups from '$/hooks/useMessageGroups'
import { useDelegatedAccount } from '$/features/delegation/hooks'

interface Props extends HTMLAttributes<HTMLDivElement> {
    messages?: IMessage[]
    resends?: IResend[]
}

const AutoScrollTolerance = 5

export default function MessageFeed({ messages = [], resends = [], ...props }: Props) {
    const rootRef = useRef<HTMLDivElement>(null)

    const stickyRef = useRef<boolean>(true)

    const groups = useMessageGroups(messages, resends)

    useEffect(() => {
        stickyRef.current = true
    }, [useSelectedRoomId()])

    useEffect(() => {
        const { current: root } = rootRef

        if (!root) {
            return
        }

        function onScroll() {
            if (!root) {
                return
            }

            stickyRef.current =
                root.scrollTop + root.clientHeight > root.scrollHeight - AutoScrollTolerance
        }

        root.addEventListener('scroll', onScroll)

        return () => {
            root.removeEventListener('scroll', onScroll)
        }
    }, [])

    useLayoutEffect(() => {
        const { current: root } = rootRef

        if (root && stickyRef.current) {
            // Auto-scroll to the most recent message.
            root.scrollTop = root.scrollHeight
        }
    }, [groups])

    const account = useWalletAccount()

    const delegatedAccount = useDelegatedAccount()

    return (
        <div
            {...props}
            ref={rootRef}
            css={tw`
                max-h-full
                overflow-auto
                px-4
                md:px-6
                pt-4
                md:pt-6
                [> *]:mt-[0.625rem]
            `}
        >
            {groups.map(({ timestamp, newDay, messages }, index) => {
                let previousCreatedBy: undefined | IMessage['createdBy']

                return (
                    <Fragment key={timestamp}>
                        <MessageGroupLabel
                            includeDate={newDay}
                            timestamp={timestamp}
                            showLoadPreviousDay={index === 0}
                            empty={messages.length === 0}
                        />
                        {messages.length === 0 && (
                            <NoMessages>
                                <Text>&middot;</Text>
                            </NoMessages>
                        )}
                        {messages.map((message) => {
                            const pcb = previousCreatedBy

                            previousCreatedBy = message.createdBy

                            return (
                                <Message
                                    key={message.id}
                                    payload={message}
                                    incoming={
                                        !isSameAddress(account, message.createdBy) &&
                                        !isSameAddress(delegatedAccount, message.createdBy)
                                    }
                                    previousCreatedBy={pcb}
                                />
                            )
                        })}
                    </Fragment>
                )
            })}
        </div>
    )
}

function NoMessages(props: HTMLAttributes<HTMLParagraphElement>) {
    return <p {...props} css={tw`text-[#59799C] text-[12px] m-0 text-center`} />
}
