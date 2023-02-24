import StreamrClient from 'streamr-client'
import tw from 'twin.macro'
import useMessages from '$/hooks/useMessages'
import ConversationHeader from './ConversationHeader'
import EmptyMessageFeed from './EmptyMessageFeed'
import MessageFeed from './MessageFeed'
import MessageInput from './MessageInput'
import { useSelectedRoomId } from '$/features/room/hooks'
import usePrivacy from '$/hooks/usePrivacy'
import useCanGrant from '$/hooks/useCanGrant'
import useResendEffect from '$/hooks/useResendEffect'
import useResends from '$/hooks/useResends'
import useAddMemberModal from '$/hooks/useAddMemberModal'
import useEditMembersModal from '$/hooks/useEditMembersModal'
import useRoomPropertiesModal from '$/hooks/useRoomPropertiesModal'
import { Flag } from '$/features/flag/types'
import { useDispatch } from 'react-redux'
import { FlagAction } from '$/features/flag'
import { useIsDelegatingAccess, useRequestPrivateKey } from '$/features/delegation/hooks'
import MessageInputPlaceholder from '$/components/Conversation/MessageInputPlaceholder'
import { ButtonHTMLAttributes } from 'react'
import SecondaryButton from '$/components/SecondaryButton'
import Text from '$/components/Text'
import Spinner from '$/components/Spinner'
import { PrivacySetting } from '$/types'
import useIsDelegatedAccountBeingPromoted from '$/hooks/useIsDelegatedAccountBeingPromoted'
import usePromoteDelegatedAccount from '$/hooks/usePromoteDelegatedAccount'
import useTokenGatedPromoteDelegatedAccount from '$/hooks/useTokenGatedPromoteDelegatedAccount'
import usePublisher, { PublisherState } from '$/hooks/usePublisher'

export default function Conversation() {
    const messages = useMessages()

    const { open: openAddMemberModal, modal: addMemberModal } = useAddMemberModal()

    const { open: openEditMembersModal, modal: editMembersModal } = useEditMembersModal()

    const { open: openRoomPropertiesModal, modal: roomPropertiesModal } = useRoomPropertiesModal()

    const canGrant = useCanGrant()

    const selectedRoomId = useSelectedRoomId()

    const resends = useResends(selectedRoomId)

    useResendEffect(selectedRoomId)

    const publisher = usePublisher(selectedRoomId)

    const canAct = publisher !== PublisherState.Unavailable

    const dispatch = useDispatch()

    return (
        <>
            {addMemberModal}
            {editMembersModal}
            {roomPropertiesModal}
            <div
                css={tw`
                    h-full
                    flex
                    flex-col
                    w-full
                `}
            >
                <ConversationHeader
                    canModifyMembers={canGrant}
                    onAddMemberClick={() => void openAddMemberModal()}
                    onEditMembersClick={() => void openEditMembersModal()}
                    onRoomPropertiesClick={() => void openRoomPropertiesModal()}
                    onGoBackClick={() => void dispatch(FlagAction.set(Flag.isDisplayingRooms()))}
                    css={tw`shrink-0`}
                />
                <div
                    css={tw`
                        grow
                        flex
                        flex-col
                        w-full
                        relative
                    `}
                >
                    <div
                        css={tw`
                            absolute
                            top-0
                            left-0
                            w-full
                            h-full
                        `}
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
                                    <MessageFeed
                                        messages={messages}
                                        resends={resends}
                                        css={tw`
                                            max-h-full
                                            overflow-auto
                                        `}
                                    />
                                </div>
                            ) : (
                                <EmptyMessageFeed
                                    onAddMemberClick={() => void openAddMemberModal()}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {canAct && (
                    <div
                        css={tw`
                            shrink-0
                            shadow-[inset 0 1px 0 #dee6ee]
                            p-4
                            lg:p-6
                        `}
                    >
                        {publisher instanceof StreamrClient && (
                            <MessageInput streamrClient={publisher} />
                        )}
                        {publisher === PublisherState.NeedsDelegation && <DelegationBox />}
                        {publisher === PublisherState.NeedsPermission && <PermitBox />}
                        {publisher === PublisherState.NeedsTokenGatedPermission && (
                            <TokenGatedBox />
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

function TokenGatedBox() {
    const isPromoting = useIsDelegatedAccountBeingPromoted()

    const promote = useTokenGatedPromoteDelegatedAccount()

    return (
        <MessageInputPlaceholder
            cta={
                <Cta
                    busy={isPromoting}
                    disabled={isPromoting || !promote}
                    onClick={() => void promote?.()}
                >
                    {isPromoting ? <>Joining...</> : <>Join</>}
                </Cta>
            }
        >
            This is a token-gated room. Join it to send messages.
        </MessageInputPlaceholder>
    )
}

function PermitBox() {
    const isPromoting = useIsDelegatedAccountBeingPromoted()

    const promote = usePromoteDelegatedAccount()

    return (
        <MessageInputPlaceholder
            cta={
                <Cta busy={isPromoting} disabled={isPromoting || !promote} onClick={promote}>
                    {isPromoting ? <>Enabling…</> : <>Enable</>}
                </Cta>
            }
        >
            Use your hot wallet to sign messages in this room.
        </MessageInputPlaceholder>
    )
}

function DelegationBox() {
    const isDelegatingAccess = useIsDelegatingAccess()

    const requestPrivateKey = useRequestPrivateKey()

    const roomId = useSelectedRoomId()

    const actions = usePrivacy(roomId) === PrivacySetting.Public ? 'send' : 'send and receive'

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
            Activate hot wallet signing to {actions} messages.
        </MessageInputPlaceholder>
    )
}

interface CtaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
