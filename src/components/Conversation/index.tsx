import { useState } from 'react'
import { StreamPermission } from 'streamr-client'
import tw from 'twin.macro'
import { useDelegatedClient } from '../../features/delegation/hooks'
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
import NeedDelegatedClientBanner from './NeedDelegatedClientBanner'

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
                <MessageBox />
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

function MessageBox() {
    const delegatedClient = useDelegatedClient()

    const canDelegatedPublish = useCurrentDelegationAbility(StreamPermission.PUBLISH)

    useLoadCurrentDelegationAbilityEffect(StreamPermission.PUBLISH)

    if (canDelegatedPublish) {
        // That's all we need: delegated account being able to push messages.
        return <MessageInput />
    }

    if (!delegatedClient) {
        return <NeedDelegatedClientBanner />
    }

    return <MessageInput disabled />
}
