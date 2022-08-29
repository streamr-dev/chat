import { Fragment, HTMLAttributes, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import tw from 'twin.macro'
import { IMessage, IResend } from '$/features/message/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import isSameAddress from '$/utils/isSameAddress'
import Message from './Message'
import { useSelectedRoomId } from '$/features/room/hooks'
import MessageGroupLabel from '$/components/Conversation/MessageGroupLabel'
import getBeginningOfDay from '$/utils/getBeginningOfDay'
import Text from '$/components/Text'

type Props = {
    messages?: IMessage[]
    resends?: IResend[]
}

const AutoScrollTolerance = 5

interface Manifest {
    messages: IMessage[]
    newDay: boolean
}

interface Manifests {
    [timestamp: string]: Manifest
}

interface Group extends Manifest {
    timestamp: number
}

function useMessageGroups(messages: IMessage[], resends: IResend[]): Group[] {
    return useMemo(() => {
        const manifests: Manifests = {}

        resends.forEach((r) => {
            manifests[r.beginningOfDay] = {
                messages: [],
                newDay: true,
            }
        })

        let previousCreatedAt: undefined | number = undefined

        let rangeTimestamp: undefined | number = undefined

        messages.forEach((m) => {
            if (typeof m.createdAt !== 'number') {
                return []
            }

            let startsDay = true

            let startsRange = true

            const bod = getBeginningOfDay(m.createdAt)

            if (typeof previousCreatedAt === 'number') {
                startsDay = bod !== getBeginningOfDay(previousCreatedAt)

                // Group messages that happen within 15 minutes from each other.
                startsRange = !startsDay && previousCreatedAt + 900000 <= m.createdAt
            }

            previousCreatedAt = m.createdAt

            if (manifests[bod]?.messages?.length === 0) {
                delete manifests[bod]
            }

            if (startsRange || startsDay) {
                rangeTimestamp = m.createdAt
            }

            if (typeof rangeTimestamp !== 'number') {
                throw new Error('This should not happen. Please report if it did.')
            }

            if (!manifests[rangeTimestamp]) {
                manifests[rangeTimestamp] = {
                    messages: [],
                    newDay: startsDay,
                }
            }

            manifests[rangeTimestamp].messages.push(m)
        })

        return Object.keys(manifests)
            .sort()
            .map((ts) => ({ timestamp: Number(ts), ...manifests[ts] }))
    }, [messages, resends])
}

export default function MessageFeed({ messages = [], resends = [] }: Props) {
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
            {groups.map(({ timestamp, newDay, messages }, index) => {
                let previousCreatedBy: IMessage['createdBy']

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
                            const hideAvatar = previousCreatedBy === message.createdBy

                            previousCreatedBy = message.createdBy

                            return (
                                <Message
                                    key={message.id}
                                    payload={message}
                                    incoming={!isSameAddress(account, message.createdBy)}
                                    hideAvatar={hideAvatar}
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
            css={[
                tw`
                    text-[#59799C]
                    text-[12px]
                    m-0
                    text-center
                `,
            ]}
        />
    )
}
