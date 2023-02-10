import { StreamPermission } from 'streamr-client'
import tw from 'twin.macro'
import useAbility from '$/hooks/useAbility'
import useMessages from '$/hooks/useMessages'
import ConversationHeader from './ConversationHeader'
import EmptyMessageFeed from './EmptyMessageFeed'
import MessageFeed from './MessageFeed'
import MessageInput from './MessageInput'
import { useSelectedRoomId } from '$/features/room/hooks'
import useCanGrant from '$/hooks/useCanGrant'
import useResendEffect from '$/hooks/useResendEffect'
import useResends from '$/hooks/useResends'
import useAddMemberModal from '$/hooks/useAddMemberModal'
import useEditMembersModal from '$/hooks/useEditMembersModal'
import useRoomPropertiesModal from '$/hooks/useRoomPropertiesModal'
import { Flag } from '$/features/flag/types'
import { useDispatch } from 'react-redux'
import { FlagAction } from '$/features/flag'
import {
    useDelegatedAccount,
    useDelegatedClient,
    useIsDelegatingAccess,
    useRequestPrivateKey,
} from '$/features/delegation/hooks'
import MessageInputPlaceholder from '$/components/Conversation/MessageInputPlaceholder'
import { ButtonHTMLAttributes } from 'react'
import SecondaryButton from '$/components/SecondaryButton'
import Text from '$/components/Text'
import Spinner from '$/components/Spinner'

export default function Conversation() {
    const messages = useMessages()

    const { open: openAddMemberModal, modal: addMemberModal } = useAddMemberModal()

    const { open: openEditMembersModal, modal: editMembersModal } = useEditMembersModal()

    const { open: openRoomPropertiesModal, modal: roomPropertiesModal } = useRoomPropertiesModal()

    const canGrant = useCanGrant()

    const selectedRoomId = useSelectedRoomId()

    const resends = useResends(selectedRoomId)

    useResendEffect(selectedRoomId)

    const account = useDelegatedAccount()

    const client = useDelegatedClient()

    const needsDelegation = !client

    const canPublish = useAbility(selectedRoomId, account, StreamPermission.PUBLISH)

    const canAct = needsDelegation || canPublish

    const dispatch = useDispatch()

    return (
        <>
            {addMemberModal}
            {editMembersModal}
            {roomPropertiesModal}
            <ConversationHeader
                canModifyMembers={canGrant}
                onAddMemberClick={() => void openAddMemberModal()}
                onEditMembersClick={() => void openEditMembersModal()}
                onRoomPropertiesClick={() => void openRoomPropertiesModal()}
                onGoBackClick={() => void dispatch(FlagAction.set(Flag.isDisplayingRooms()))}
            />
            <div
                css={[
                    tw`
                        h-full
                        pt-[72px]
                        lg:pt-[92px]
                    `,
                    canAct &&
                        tw`
                            pb-[80px]
                            lg:pb-[96px]
                        `,
                ]}
            >
                <div css={tw`h-full`}>
                    {(messages || []).length ? (
                        <div
                            css={tw`
                                h-full
                                flex
                                flex-col
                            `}
                        >
                            <div css={tw`grow`} />
                            <MessageFeed messages={messages} resends={resends} />
                        </div>
                    ) : (
                        <EmptyMessageFeed
                            canModifyMembers={canGrant}
                            onAddMemberClick={() => void openAddMemberModal()}
                        />
                    )}
                </div>
            </div>
            {canAct && (
                <div
                    css={tw`
                        shadow-[inset 0 1px 0 #dee6ee]
                        absolute
                        p-4
                        lg:p-6
                        bottom-0
                        left-0
                        w-full
                    `}
                >
                    {needsDelegation ? <DelegationBox /> : <MessageInput streamrClient={client} />}
                </div>
            )}
        </>
    )
}

function DelegationBox() {
    const isDelegatingAccess = useIsDelegatingAccess()

    const requestPrivateKey = useRequestPrivateKey()

    return (
        <MessageInputPlaceholder
            cta={
                <Cta
                    busy={isDelegatingAccess}
                    disabled={isDelegatingAccess}
                    onClick={requestPrivateKey}
                >
                    {isDelegatingAccess ? <>Enabling…</> : <>Enable</>}
                </Cta>
            }
        >
            Activate hot wallet signing to send messages.
        </MessageInputPlaceholder>
    )
}

type CtaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    busy?: boolean
}

function Cta({ children, busy = false, ...props }: CtaProps) {
    return (
        <SecondaryButton {...props} css={tw`text-[0.875rem] h-8 px-4`}>
            <div
                css={tw`
                    flex
                    items-center
                `}
            >
                <div>
                    <Text>{children}</Text>
                </div>
                {busy && (
                    <div
                        css={tw`
                            ml-2
                            relative
                            w-4
                            h-4
                        `}
                    >
                        <Spinner r={5} strokeWidth={1} />
                    </div>
                )}
            </div>
        </SecondaryButton>
    )
}
