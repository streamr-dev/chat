import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import tw from 'twin.macro'
import { fetchPermission } from '../../features/permissions/actions'
import { useAbility } from '../../features/permissions/hooks'
import { useSelectedRoomId } from '../../features/rooms/hooks'
import { useWalletAccount } from '../../features/wallet/hooks'
import useMessages from '../../hooks/useMessages'
import AddMemberModal from '../AddMemberModal'
import EditMembersModal from '../EditMembersModal'
import ConversationHeader from './ConversationHeader'
import EmptyMessageFeed from './EmptyMessageFeed'
import MessageFeed from './MessageFeed'
import MessageInput from './MessageInput'

export default function Conversation() {
    const selectedRoomId = useSelectedRoomId()

    const messages = useMessages()

    const [addMemberModalOpen, setAddMemberModalOpen] = useState<boolean>(false)

    const [editMembersModalOpen, setEditMembersModalOpen] = useState<boolean>(false)

    const dispatch = useDispatch()

    const account = useWalletAccount()

    const canGrant = useAbility(selectedRoomId, account, StreamPermission.GRANT)

    const canPublish = useAbility(selectedRoomId, account, StreamPermission.PUBLISH)

    useEffect(() => {
        if (!selectedRoomId || !account) {
            return
        }

        dispatch(
            fetchPermission({
                roomId: selectedRoomId,
                address: account,
                permission: StreamPermission.GRANT,
            })
        )

        dispatch(
            fetchPermission({
                roomId: selectedRoomId,
                address: account,
                permission: StreamPermission.PUBLISH,
            })
        )
    }, [dispatch, selectedRoomId, account])

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
