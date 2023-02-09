import { ButtonHTMLAttributes } from 'react'
import { StreamPermission } from 'streamr-client'
import type StreamrClient from 'streamr-client'
import tw from 'twin.macro'
import {
    useDelegatedAccount,
    useDelegatedClient,
    useIsDelegatingAccess,
    useRequestPrivateKey,
} from '$/features/delegation/hooks'
import useAbility from '$/hooks/useAbility'
import useMessages from '$/hooks/useMessages'
import ConversationHeader from './ConversationHeader'
import EmptyMessageFeed from './EmptyMessageFeed'
import MessageFeed from './MessageFeed'
import MessageInput from './MessageInput'
import MessageInputPlaceholder from './MessageInputPlaceholder'
import Text from '../Text'
import SecondaryButton from '../SecondaryButton'
import { useSelectedRoomId } from '$/features/room/hooks'
import useCanGrant from '$/hooks/useCanGrant'
import useJustInvited from '$/hooks/useJustInvited'
import { useWalletAccount } from '$/features/wallet/hooks'
import Spinner from '$/components/Spinner'
import useAcceptInvite from '$/hooks/useAcceptInvite'
import useIsDelegatedAccountBeingPromoted from '$/hooks/useIsDelegatedAccountBeingPromoted'
import useIsInviteBeingAccepted from '$/hooks/useIsInviteBeingAccepted'
import usePromoteDelegatedAccount from '$/hooks/usePromoteDelegatedAccount'
import useResendEffect from '$/hooks/useResendEffect'
import useResends from '$/hooks/useResends'
import useAddMemberModal from '$/hooks/useAddMemberModal'
import useEditMembersModal from '$/hooks/useEditMembersModal'
import useRoomPropertiesModal from '$/hooks/useRoomPropertiesModal'
import { Flag } from '$/features/flag/types'
import { useDispatch } from 'react-redux'
import { FlagAction } from '$/features/flag'

export default function Conversation() {
    const messages = useMessages()

    const { open: openAddMemberModal, modal: addMemberModal } = useAddMemberModal()

    const { open: openEditMembersModal, modal: editMembersModal } = useEditMembersModal()

    const { open: openRoomPropertiesModal, modal: roomPropertiesModal } = useRoomPropertiesModal()

    const canGrant = useCanGrant()

    const selectedRoomId = useSelectedRoomId()

    const resends = useResends(selectedRoomId)

    useResendEffect(selectedRoomId)

    const delegatedClient = useDelegatedClient()

    const delegatedAccount = useDelegatedAccount()

    const canDelegatedPublish = useAbility(
        selectedRoomId,
        delegatedAccount,
        StreamPermission.PUBLISH
    )

    const canDelegatedSubscribe = useAbility(
        selectedRoomId,
        delegatedAccount,
        StreamPermission.SUBSCRIBE
    )

    const justInvited = useJustInvited(useSelectedRoomId(), useWalletAccount())

    const canDoAnything =
        (canDelegatedPublish && canDelegatedSubscribe) ||
        !delegatedClient ||
        justInvited ||
        canGrant

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
                    canDoAnything &&
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
                            <MessageFeed
                                messages={messages}
                                resends={resends}
                                css={[!canDoAnything && tw`pb-10`]}
                            />
                        </div>
                    ) : (
                        <EmptyMessageFeed
                            canModifyMembers={canGrant}
                            onAddMemberClick={() => void openAddMemberModal()}
                        />
                    )}
                </div>
            </div>
            {canDoAnything && (
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
                    <MessageBox
                        canGrant={canGrant}
                        delegatedClient={delegatedClient}
                        canDelegatedPublish={canDelegatedPublish}
                        canDelegatedSubscribe={canDelegatedSubscribe}
                        justInvited={justInvited}
                    />
                </div>
            )}
        </>
    )
}

interface MessageBoxProps {
    canGrant: boolean
    canDelegatedPublish: boolean
    canDelegatedSubscribe: boolean
    delegatedClient: undefined | StreamrClient
    justInvited: boolean
}

function MessageBox({
    canGrant,
    canDelegatedPublish,
    canDelegatedSubscribe,
    delegatedClient,
    justInvited,
}: MessageBoxProps) {
    const isDelegatingAccess = useIsDelegatingAccess()

    const requestPrivateKey = useRequestPrivateKey()

    const isBeingAccepted = useIsInviteBeingAccepted()

    const acceptInvite = useAcceptInvite()

    const isPromoting = useIsDelegatedAccountBeingPromoted()

    const promoteDelegatedAccount = usePromoteDelegatedAccount()

    if (canDelegatedPublish && canDelegatedSubscribe) {
        // We can stop here. For publishing that's all that matters.
        return <MessageInput />
    }

    if (!delegatedClient) {
        return (
            <MessageInputPlaceholder
                cta={
                    <Cta
                        busy={isDelegatingAccess}
                        disabled={isDelegatingAccess}
                        onClick={requestPrivateKey}
                    >
                        {isDelegatingAccess ? <>Delegating…</> : <>Delegate now</>}
                    </Cta>
                }
            >
                Publishing messages requires room access delegation.
            </MessageInputPlaceholder>
        )
    }

    if (justInvited) {
        return (
            <MessageInputPlaceholder
                cta={
                    <Cta busy={isBeingAccepted} disabled={isBeingAccepted} onClick={acceptInvite}>
                        {isBeingAccepted ? <>Joining…</> : <>Join</>}
                    </Cta>
                }
            >
                You've been invited into this room.
            </MessageInputPlaceholder>
        )
    }

    if (canGrant) {
        return (
            <MessageInputPlaceholder
                cta={
                    <Cta
                        busy={isPromoting}
                        disabled={isPromoting}
                        onClick={promoteDelegatedAccount}
                    >
                        {isPromoting ? <>Enabling…</> : <>Enable</>}
                    </Cta>
                }
            >
                Activate hot wallet signing to send messages
            </MessageInputPlaceholder>
        )
    }

    return <MessageInput disabled />
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
