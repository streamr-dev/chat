import Modal, { Props } from '$/components/modals/Modal'
import { HTMLAttributes } from 'react'
import tw from 'twin.macro'

export default function HowItWorksModal({ title = 'How it works?', ...props }: Props) {
    return (
        <Modal {...props} title={title}>
            <P>
                Every chatroom is a stream on the Streamr Network and the chat room participants are
                registered on the on-chain stream registry. The fabric underpinning every chat room
                is a peer-to-peer WebRTC mesh network composed of the participants of the
                chat&nbsp;room.
            </P>
            <P>
                Streams, and chat rooms come in two main flavors - public and private. Public
                meaning publicly readable, whereas private is end-to-end&nbsp;encrypted.
            </P>
            <P>
                If you wish to make a private group to chat with your friends, or with a community -
                you can now do so without any intermediary and with full confidence you are chatting
                with exactly who you think you're chatting&nbsp;with!
            </P>
        </Modal>
    )
}

function P(props: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            {...props}
            css={[
                tw`
                    text-[14px]
                    [& + p]:mt-6
                    leading-6
                `,
            ]}
        />
    )
}
