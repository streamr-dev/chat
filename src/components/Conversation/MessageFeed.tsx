import { useLayoutEffect, useRef } from 'react'
import tw from 'twin.macro'
import { IMessage } from '../../features/messages/types'
import { useWalletAccount } from '../../features/wallet/hooks'
import isSameAddress from '../../utils/isSameAddress'
import Message from './Message'

type Props = {
    messages?: IMessage[]
}

export default function MessageFeed({ messages = [] }: Props) {
    const rootRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const { current: root } = rootRef

        if (root) {
            // Auto-scroll to the most recent message.
            root.scrollTop = root.scrollHeight
        }
    }, [messages])

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
            {messages.map((message) => (
                <Message
                    key={message.id}
                    payload={message}
                    incoming={isSameAddress(account, message.createdBy)}
                />
            ))}
        </div>
    )
}
