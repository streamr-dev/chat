import { Fragment, HTMLAttributes, useEffect, useLayoutEffect, useRef } from 'react'
import tw from 'twin.macro'
import { IMessage, IResend } from '$/features/message/types'
import Message from './Message'
import { useSelectedRoomId } from '$/features/room/hooks'
import MessageGroupLabel from '$/components/Conversation/MessageGroupLabel'
import Text from '$/components/Text'
import useMessageGroups from '$/hooks/useMessageGroups'

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

    return (
        <div
            {...props}
            ref={rootRef}
            css={tw`
                px-4
                lg:px-6
                py-4
                lg:py-6
                [> *]:mt-1.5
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
    return (
        <p
            {...props}
            css={tw`
                text-[#59799C]
                text-[12px]
                m-0
                text-center
            `}
        />
    )
}
