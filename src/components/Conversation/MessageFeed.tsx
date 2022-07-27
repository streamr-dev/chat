import { Fragment, useEffect, useLayoutEffect, useRef } from 'react'
import tw from 'twin.macro'
import { IMessage } from '$/features/message/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import isSameAddress from '$/utils/isSameAddress'
import Message from './Message'
import { useSelectedRoomId } from '$/features/room/hooks'
import getBeginningOfDay, { TimezoneOffset } from '$/utils/getBeginningOfDay'
import DateSeparator from '$/components/Conversation/DateSeparator'

type Props = {
    messages?: IMessage[]
}

const AutoScrollTolerance = 5

export default function MessageFeed({ messages = [] }: Props) {
    const rootRef = useRef<HTMLDivElement>(null)

    const stickyRef = useRef<boolean>(true)

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
    }, [messages])

    const account = useWalletAccount()

    let previousCreatedBy: IMessage['createdBy']

    let previousCreatedAt: undefined | number = undefined

    return (
        <div
            ref={rootRef}
            css={[
                tw`
                    max-h-full
                    overflow-auto
                    px-6
                    pt-6
                    [> *]:mt-[0.625rem]
                `,
            ]}
        >
            {messages.map((message) => {
                let sameDay = false

                let withinRange = false

                if (typeof message.createdAt === 'number') {
                    if (typeof previousCreatedAt === 'number') {
                        sameDay =
                            getBeginningOfDay(message.createdAt - TimezoneOffset) ===
                            getBeginningOfDay(previousCreatedAt - TimezoneOffset)

                        withinRange = sameDay && previousCreatedAt + 900000 > message.createdAt
                    }

                    previousCreatedAt = message.createdAt
                }

                previousCreatedBy = message.createdBy

                const hideAvatar = previousCreatedBy === message.createdBy && withinRange

                return (
                    <Fragment key={message.id}>
                        {!withinRange && typeof message.createdAt === 'number' && (
                            <DateSeparator includeDate={!sameDay} timestamp={message.createdAt} />
                        )}
                        <Message
                            payload={message}
                            incoming={!isSameAddress(account, message.createdBy)}
                            hideAvatar={hideAvatar}
                        />
                    </Fragment>
                )
            })}
        </div>
    )
}
