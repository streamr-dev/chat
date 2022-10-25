import { ButtonHTMLAttributes, useState } from 'react'
import { StreamPermission } from 'streamr-client'
import tw from 'twin.macro'
import {
    useDelegatedClient,
    useIsDelegatingAccess,
    useRequestPrivateKey,
} from '$/features/delegation/hooks'
import {
    useCurrentDelegationAbility,
    useLoadCurrentDelegationAbilityEffect,
} from '$/features/permission/hooks'
import useMessages from '$/hooks/useMessages'
import AddMemberModal from '../modals/AddMemberModal'
import EditMembersModal from '../modals/EditMembersModal'
import ConversationHeader from './ConversationHeader'
import EmptyMessageFeed from './EmptyMessageFeed'
import MessageFeed from './MessageFeed'
import MessageInput from './MessageInput'
import MessageInputPlaceholder from './MessageInputPlaceholder'
import Text from '../Text'
import SecondaryButton from '../SecondaryButton'
import { usePrivacyOption, useSelectedRoomId } from '$/features/room/hooks'
import RoomPropertiesModal from '../modals/RoomPropertiesModal'
import useCanGrant from '$/hooks/useCanGrant'
import useJustInvited from '$/hooks/useJustInvited'
import { useWalletAccount } from '$/features/wallet/hooks'
import Spinner from '$/components/Spinner'
import {
    useAcceptInvite,
    useIsJoiningTokenGatedRoom,
    useIsInviteBeingAccepted,
    usePromoteDelegatedAccount,
} from '$/features/member/hooks'
import useResendEffect from '$/hooks/useResendEffect'
import useResends from '$/hooks/useResends'
import { TokenGatedRoomOption } from '$/components/PrivacySelectField'

export default function Conversation() {
    const messages = useMessages()

    const [roomPropertiesModalOpen, setRoomPropertiesModalOpen] = useState<boolean>(false)

    const [addMemberModalOpen, setAddMemberModalOpen] = useState<boolean>(false)

    const [editMembersModalOpen, setEditMembersModalOpen] = useState<boolean>(false)

    const canGrant = useCanGrant()

    const selectedRoomId = useSelectedRoomId()

    const resends = useResends(selectedRoomId)

    useResendEffect(selectedRoomId)

    return (
        <>
            <ConversationHeader
                canModifyMembers={canGrant}
                onAddMemberClick={() => void setAddMemberModalOpen(true)}
                onEditMembersClick={() => void setEditMembersModalOpen(true)}
                onRoomPropertiesClick={() => void setRoomPropertiesModalOpen(true)}
            />
            <div
                css={[
                    tw`
                        h-full
                        pt-[92px]
                        pb-[92px]
                    `,
                ]}
            >
                <div tw="h-full">
                    {(messages || []).length ? (
                        <div
                            css={[
                                tw`
                                    h-full
                                    flex
                                    flex-col
                                `,
                            ]}
                        >
                            <div tw="flex-grow" />
                            <MessageFeed messages={messages} resends={resends} />
                        </div>
                    ) : (
                        <EmptyMessageFeed
                            canModifyMembers={canGrant}
                            onAddMemberClick={() => void setAddMemberModalOpen(true)}
                        />
                    )}
                </div>
            </div>
            <div
                css={[
                    tw`
                        absolute
                        p-6
                        bottom-0
                        left-0
                        w-full
                    `,
                ]}
            >
                <MessageBox canGrant={canGrant} />
            </div>
            <>
                <AddMemberModal
                    canModifyMembers={canGrant}
                    open={addMemberModalOpen}
                    setOpen={setAddMemberModalOpen}
                />
                <EditMembersModal
                    canModifyMembers={canGrant}
                    open={editMembersModalOpen}
                    setOpen={setEditMembersModalOpen}
                />
                <RoomPropertiesModal
                    open={roomPropertiesModalOpen}
                    setOpen={setRoomPropertiesModalOpen}
                />
            </>
        </>
    )
}

interface MessageBoxProps {
    canGrant?: boolean
}

function MessageBox({ canGrant = false }: MessageBoxProps) {
    const roomId = useSelectedRoomId()
    const delegatedClient = useDelegatedClient()

    const canDelegatedPublish = useCurrentDelegationAbility(StreamPermission.PUBLISH)

    useLoadCurrentDelegationAbilityEffect(StreamPermission.PUBLISH)

    const canDelegatedSubscribe = useCurrentDelegationAbility(StreamPermission.SUBSCRIBE)

    useLoadCurrentDelegationAbilityEffect(StreamPermission.SUBSCRIBE)

    const justInvited = useJustInvited(roomId, useWalletAccount())

    const isDelegatingAccess = useIsDelegatingAccess()

    const isBeingAccepted = useIsInviteBeingAccepted()

    const isPromoting = useIsJoiningTokenGatedRoom()

    const requestPrivateKey = useRequestPrivateKey()

    const acceptInvite = useAcceptInvite()

    const promoteDelegatedAccount = usePromoteDelegatedAccount()

    const privacyOption = usePrivacyOption(roomId)

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
                        {isBeingAccepted ? <>Accepting the invite…</> : <>Accept</>}
                    </Cta>
                }
            >
                You've been invited into this room.
            </MessageInputPlaceholder>
        )
    }

    if (canGrant || privacyOption === TokenGatedRoomOption) {
        return (
            <MessageInputPlaceholder
                cta={
                    <Cta
                        busy={isPromoting}
                        disabled={isPromoting}
                        onClick={promoteDelegatedAccount}
                    >
                        {isPromoting ? <>Promoting…</> : <>Promote it</>}
                    </Cta>
                }
            >
                Your delegated account is not a publisher in this room.
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
        <SecondaryButton
            {...props}
            css={[
                tw`
                    text-[0.875rem]
                    h-8
                    px-4
                `,
            ]}
        >
            <div
                css={[
                    tw`
                        flex
                        items-center
                    `,
                ]}
            >
                <div>
                    <Text>{children}</Text>
                </div>
                {busy && (
                    <div
                        css={[
                            tw`
                                ml-2
                                relative
                                w-4
                                h-4
                            `,
                        ]}
                    >
                        <Spinner r={5} strokeWidth={1} />
                    </div>
                )}
            </div>
        </SecondaryButton>
    )
}
