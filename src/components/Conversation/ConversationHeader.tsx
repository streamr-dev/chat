import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import tw, { css } from 'twin.macro'
import { useCurrentAbility, useLoadCurrentAbilityEffect } from '../../features/permissions/hooks'
import { deleteRoom, renameRoom } from '../../features/rooms/actions'
import { useSelectedRoomId } from '../../features/rooms/hooks'
import { useWalletAccount } from '../../features/wallet/hooks'
import useCopy from '../../hooks/useCopy'
import useSelectedRoom from '../../hooks/useSelectedRoom'
import AddMemberIcon from '../../icons/AddMemberIcon'
import CopyIcon from '../../icons/CopyIcon'
import DeleteIcon from '../../icons/DeleteIcon'
import EditMembersIcon from '../../icons/EditMembersIcon'
import MoreIcon from '../../icons/MoreIcon'
import ActionButton from '../ActionButton'
import Form from '../Form'
import Menu, { MenuButtonItem, MenuSeparatorItem } from '../Menu'
import Text from '../Text'
import ActionTextButton from './ActionTextButton'

type Props = {
    canModifyMembers?: boolean
    onAddMemberClick?: () => void
    onEditMembersClick?: () => void
}

export default function ConversationHeader({
    canModifyMembers = false,
    onAddMemberClick,
    onEditMembersClick,
}: Props) {
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    useLoadCurrentAbilityEffect(StreamPermission.EDIT)

    const canDelete = useCurrentAbility(StreamPermission.DELETE)

    useLoadCurrentAbilityEffect(StreamPermission.DELETE)

    const { name = '' } = useSelectedRoom() || {}

    const selectedRoomId = useSelectedRoomId()

    const [isRoomNameEditable, setIsRoomNameEditable] = useState<boolean>(false)

    const [newRoomName, setNewRoomName] = useState<string>(name)

    useEffect(() => {
        setNewRoomName(name)
    }, [name])

    useEffect(() => {
        setIsRoomNameEditable(false)
    }, [selectedRoomId])

    function abortNameEdit() {
        setIsRoomNameEditable(false)
        setNewRoomName(name)
    }

    function onNameDoubleClick() {
        if (canEdit) {
            setIsRoomNameEditable(true)
        }
    }

    useEffect(() => {
        if (!canEdit) {
            setIsRoomNameEditable(false)
        }
    }, [canEdit])

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Escape') {
            abortNameEdit()
        }
    }

    const [roomMenuOpen, setRoomMenuOpen] = useState<boolean>(false)

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null)

    const { copy } = useCopy()

    const dispatch = useDispatch()

    function onRenameSubmit() {
        if (selectedRoomId) {
            dispatch(renameRoom({ roomId: selectedRoomId, name: newRoomName }))
        }

        setIsRoomNameEditable(false)
    }

    const account = useWalletAccount()

    return (
        <Form
            css={[
                tw`
                    absolute
                    left-0
                    top-0
                    flex
                    items-center
                    h-[92px]
                    px-6
                    shadow-[inset 0 -1px 0 #dee6ee]
                    w-full
                `,
            ]}
            onSubmit={onRenameSubmit}
        >
            <div tw="flex-grow">
                {isRoomNameEditable ? (
                    <div>
                        <input
                            css={[
                                tw`
                                    text-black
                                    appearance-none
                                    border-0
                                    outline-none
                                    p-0
                                    w-full
                                    text-[1.375rem]
                                    placeholder:text-[#59799C]
                                `,
                            ]}
                            autoFocus
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                void setNewRoomName(e.target.value)
                            }
                            onKeyDown={onKeyDown}
                            placeholder="e.g. random-giggly-bear"
                            type="text"
                            value={newRoomName}
                        />
                        <div
                            css={[
                                tw`
                                    text-[0.875rem]
                                    text-[#59799C]
                                `,
                            ]}
                        >
                            The room name will be publicly visible.
                        </div>
                    </div>
                ) : (
                    <div
                        onDoubleClick={onNameDoubleClick}
                        css={[
                            css`
                                line-height: normal;
                            `,
                            tw`
                                text-[1.625rem]
                                font-medium
                                select-none
                            `,
                        ]}
                    >
                        <Text tw="truncate">{name || 'Unnamed room'}&zwnj;</Text>
                    </div>
                )}
            </div>
            {isRoomNameEditable ? (
                <div
                    css={[
                        tw`
                            flex
                            [button + button]:ml-2
                        `,
                    ]}
                >
                    <ActionTextButton secondary onClick={abortNameEdit}>
                        <Text>Cancel</Text>
                    </ActionTextButton>
                    <ActionTextButton type="submit">
                        <Text>Save</Text>
                    </ActionTextButton>
                </div>
            ) : (
                <div tw="flex">
                    {canEdit && (
                        <ActionButton onClick={() => void setIsRoomNameEditable(true)}>
                            <svg
                                tw="block"
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22.8985 11.8152C23.2077 11.5061 23.709 11.5061 24.0181 11.8152L27.1848 14.9819C27.494 15.291 27.494 15.7923 27.1848 16.1015L16.8931 26.3931C16.7447 26.5416 16.5433 26.625 16.3333 26.625H13.1667C12.7294 26.625 12.375 26.2706 12.375 25.8333V22.6667C12.375 22.4567 12.4584 22.2554 12.6069 22.1069L20.5234 14.1904L22.8985 11.8152ZM21.0833 15.8696L13.9583 22.9946V25.0417H16.0054L23.1304 17.9167L21.0833 15.8696ZM24.25 16.7971L25.5054 15.5417L23.4583 13.4946L22.2029 14.75L24.25 16.7971Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </ActionButton>
                    )}
                    <ActionButton
                        tw="ml-3"
                        active={roomMenuOpen}
                        onClick={() => void setRoomMenuOpen((current) => !current)}
                        ref={setMenuAnchorEl}
                    >
                        <MoreIcon />
                    </ActionButton>
                    {roomMenuOpen && (
                        <Menu
                            anchorEl={menuAnchorEl}
                            onMouseDownOutside={() => void setRoomMenuOpen(false)}
                        >
                            {canModifyMembers && (
                                <>
                                    <MenuButtonItem
                                        icon={<AddMemberIcon />}
                                        onClick={() => {
                                            if (typeof onAddMemberClick === 'function') {
                                                onAddMemberClick()
                                            }

                                            setRoomMenuOpen(false)
                                        }}
                                    >
                                        Add member
                                    </MenuButtonItem>
                                    <MenuButtonItem
                                        icon={<EditMembersIcon />}
                                        onClick={() => {
                                            if (typeof onEditMembersClick === 'function') {
                                                onEditMembersClick()
                                            }

                                            setRoomMenuOpen(false)
                                        }}
                                    >
                                        Edit members
                                    </MenuButtonItem>
                                    <MenuSeparatorItem />
                                </>
                            )}
                            <MenuButtonItem
                                icon={<CopyIcon />}
                                onClick={() => {
                                    copy(selectedRoomId!)
                                    setRoomMenuOpen(false)
                                }}
                            >
                                Copy room id
                            </MenuButtonItem>
                            {canDelete && (
                                <>
                                    <MenuSeparatorItem />
                                    <MenuButtonItem
                                        icon={<DeleteIcon />}
                                        onClick={() => {
                                            if (account && selectedRoomId) {
                                                dispatch(
                                                    deleteRoom({
                                                        owner: account,
                                                        roomId: selectedRoomId,
                                                    })
                                                )
                                            }
                                            setRoomMenuOpen(false)
                                        }}
                                    >
                                        Delete room
                                    </MenuButtonItem>
                                </>
                            )}
                        </Menu>
                    )}
                </div>
            )}
        </Form>
    )
}
