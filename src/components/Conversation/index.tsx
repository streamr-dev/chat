import { ButtonHTMLAttributes, ReactNode, useState } from 'react'
import { StreamPermission } from 'streamr-client'
import tw from 'twin.macro'
import { useDelegatedAccount, useDelegatedClient } from '../../features/delegation/hooks'
import {
    useCurrentAbility,
    useCurrentDelegationAbility,
    useLoadCurrentAbilityEffect,
    useLoadCurrentDelegationAbilityEffect,
} from '../../features/permissions/hooks'
import useMessages from '../../hooks/useMessages'
import AddMemberModal from '../modals/AddMemberModal'
import EditMembersModal from '../modals/EditMembersModal'
import ConversationHeader from './ConversationHeader'
import EmptyMessageFeed from './EmptyMessageFeed'
import MessageFeed from './MessageFeed'
import MessageInput from './MessageInput'
import MessageInputPlaceholder from './MessageInputPlaceholder'
import Text from '../Text'
import SecondaryButton from '../SecondaryButton'
import { useDispatch } from 'react-redux'
import { requestDelegatedPrivateKey } from '../../features/delegation/actions'
import { useSelectedRoomId } from '../../features/rooms/hooks'
import { setMemberPermissions } from '../../features/members/actions'

export default function Conversation() {
    const messages = useMessages()

    const [addMemberModalOpen, setAddMemberModalOpen] = useState<boolean>(false)

    const [editMembersModalOpen, setEditMembersModalOpen] = useState<boolean>(false)

    const canGrant = useCurrentAbility(StreamPermission.GRANT)

    useLoadCurrentAbilityEffect(StreamPermission.GRANT)

    return (
        <>
            <ConversationHeader
                canModifyMembers={canGrant}
                onAddMemberClick={() => void setAddMemberModalOpen(true)}
                onEditMembersClick={() => void setEditMembersModalOpen(true)}
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
                            <MessageFeed messages={messages} />
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
            </>
        </>
    )
}

interface MessageBoxProps {
    canGrant?: boolean
}

function MessageBox({ canGrant = false }: MessageBoxProps) {
    const delegatedClient = useDelegatedClient()

    const canDelegatedPublish = useCurrentDelegationAbility(StreamPermission.PUBLISH)

    useLoadCurrentDelegationAbilityEffect(StreamPermission.PUBLISH)

    const dispatch = useDispatch()

    const delegatedAccount = useDelegatedAccount()

    const selectedRoomId = useSelectedRoomId()

    if (canDelegatedPublish) {
        // We can stop here. For publishing that's all that matters.
        return <MessageInput />
    }

    if (!delegatedClient) {
        return (
            <MessageInputPlaceholder
                cta={
                    <Cta onClick={() => void dispatch(requestDelegatedPrivateKey())}>
                        Delegate now
                    </Cta>
                }
            >
                Message publishing requires a delegated account.
            </MessageInputPlaceholder>
        )
    }

    if (canGrant) {
        return (
            <MessageInputPlaceholder
                cta={
                    <Cta
                        onClick={() => {
                            if (!selectedRoomId || !delegatedAccount) {
                                return
                            }

                            dispatch(
                                setMemberPermissions({
                                    roomId: selectedRoomId,
                                    address: delegatedAccount,
                                    permissions: [StreamPermission.PUBLISH],
                                })
                            )
                        }}
                    >
                        Promote it
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
    children?: ReactNode
}

function Cta({ children, ...props }: CtaProps) {
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
            <Text>{children}</Text>
        </SecondaryButton>
    )
}
