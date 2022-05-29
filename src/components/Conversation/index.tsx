import { useState } from 'react'
import { StreamPermission } from 'streamr-client'
import tw from 'twin.macro'
import { useCurrentAbility, useLoadCurrentAbilityEffect } from '../../features/permissions/hooks'
import useMessages from '../../hooks/useMessages'
import AddMemberModal from '../modals/AddMemberModal'
import EditMembersModal from '../modals/EditMembersModal'
import ConversationHeader from './ConversationHeader'
import EmptyMessageFeed from './EmptyMessageFeed'
import MessageFeed from './MessageFeed'
import MessageInput from './MessageInput'

export default function Conversation() {
    const messages = useMessages()

    const [addMemberModalOpen, setAddMemberModalOpen] = useState<boolean>(false)

    const [editMembersModalOpen, setEditMembersModalOpen] = useState<boolean>(false)

    const canGrant = useCurrentAbility(StreamPermission.GRANT)

    useLoadCurrentAbilityEffect(StreamPermission.GRANT)

    const canPublish = useCurrentAbility(StreamPermission.PUBLISH)

    useLoadCurrentAbilityEffect(StreamPermission.PUBLISH)

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
            <MessageInput disabled={!canPublish} />
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
