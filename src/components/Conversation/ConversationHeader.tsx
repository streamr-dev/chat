import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import tw, { css } from 'twin.macro'
import { useCurrentAbility, useLoadCurrentAbilityEffect } from '$/features/permission/hooks'
import { RoomAction } from '$/features/room'
import {
    useEditingRoomName,
    useIsBeingDeleted,
    usePersistingRoomName,
    usePrivacyOption,
    useSelectedRoomId,
    useTransientRoomName,
} from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useCopy from '$/hooks/useCopy'
import useSelectedRoom from '$/hooks/useSelectedRoom'
import AddMemberIcon from '$/icons/AddMemberIcon'
import CopyIcon from '$/icons/CopyIcon'
import DeleteIcon from '$/icons/DeleteIcon'
import EditMembersIcon from '$/icons/EditMembersIcon'
import GearIcon from '$/icons/GearIcon'
import { success } from '$/utils/toaster'
import ActionButton from '../ActionButton'
import Form from '../Form'
import Menu, { MenuButtonItem, MenuSeparatorItem } from '../Menu'
import Text from '../Text'
import ActionTextButton from './ActionTextButton'
import LoadingIndicator, { LoadingState } from '$/components/LoadingIndicator'
import MoreActionButton from '$/components/MoreActionButton'
import EyeIcon from '$/icons/EyeIcon'
import useIsRoomVisible from '$/hooks/useIsRoomVisible'
import useIsRoomPinned from '$/hooks/useIsRoomPinned'
import PinIcon from '$/icons/PinIcon'

type Props = {
    canModifyMembers?: boolean
    onAddMemberClick?: () => void
    onEditMembersClick?: () => void
    onRoomPropertiesClick?: () => void
}

export default function ConversationHeader({
    canModifyMembers = false,
    onAddMemberClick,
    onEditMembersClick,
    onRoomPropertiesClick,
}: Props) {
    const dispatch = useDispatch()

    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    useLoadCurrentAbilityEffect(StreamPermission.EDIT)

    const canDelete = useCurrentAbility(StreamPermission.DELETE)

    useLoadCurrentAbilityEffect(StreamPermission.DELETE)

    const { name = '' } = useSelectedRoom() || {}

    const selectedRoomId = useSelectedRoomId()

    const isRoomNameEditable = useEditingRoomName(selectedRoomId)

    const isPersistingRoomName = usePersistingRoomName(selectedRoomId)

    const transientRoomName = useTransientRoomName(selectedRoomId)

    const isRoomBeingDeleted = useIsBeingDeleted(selectedRoomId)

    function edit() {
        if (canEdit && selectedRoomId && !isRoomBeingDeleted) {
            dispatch(RoomAction.setTransientName({ roomId: selectedRoomId, name }))
            dispatch(RoomAction.setEditingName({ roomId: selectedRoomId, state: true }))
        }
    }

    useEffect(() => {
        if (!selectedRoomId) {
            return
        }

        if (!canEdit) {
            dispatch(
                RoomAction.setEditingName({
                    roomId: selectedRoomId,
                    state: false,
                })
            )
        }
    }, [canEdit, selectedRoomId])

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Escape' && selectedRoomId) {
            dispatch(
                RoomAction.setEditingName({
                    roomId: selectedRoomId,
                    state: false,
                })
            )
        }
    }

    const [roomMenuOpen, setRoomMenuOpen] = useState<boolean>(false)

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null)

    const { copy } = useCopy()

    function onRenameSubmit() {
        if (selectedRoomId) {
            dispatch(RoomAction.rename({ roomId: selectedRoomId, name: transientRoomName }))
        }
    }

    const account = useWalletAccount()

    const { icon: PrivacyIcon, desc: privacyDesc } = usePrivacyOption(selectedRoomId)

    useEffect(() => {
        if (!selectedRoomId) {
            return
        }

        dispatch(RoomAction.getPrivacy(selectedRoomId))
    }, [selectedRoomId])

    const showProgress = isPersistingRoomName || isRoomBeingDeleted

    const isVisible = useIsRoomVisible(selectedRoomId)

    const isPinned = useIsRoomPinned(selectedRoomId)

    return (
        <div
            css={[
                tw`
                    absolute
                    left-0
                    top-0
                    h-[92px]
                    w-full
                `,
            ]}
        >
            <LoadingIndicator
                tw="absolute bottom-0 left-0 w-full"
                state={showProgress ? LoadingState.Busy : undefined}
            />
            <Form
                css={[
                    tw`
                        flex
                        items-center
                        px-6
                        shadow-[inset 0 -1px 0 #dee6ee]
                        w-full
                        h-full
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
                                        disabled:bg-transparent
                                    `,
                                ]}
                                autoFocus
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (!selectedRoomId) {
                                        return
                                    }

                                    dispatch(
                                        RoomAction.setTransientName({
                                            roomId: selectedRoomId,
                                            name: e.target.value,
                                        })
                                    )
                                }}
                                onKeyDown={onKeyDown}
                                placeholder="e.g. random-giggly-bear"
                                type="text"
                                value={transientRoomName}
                                disabled={isPersistingRoomName}
                            />
                            <div
                                css={[
                                    tw`
                                        text-[0.875rem]
                                        text-[#59799C]
                                    `,
                                ]}
                            >
                                {isPersistingRoomName ? (
                                    <>
                                        Renaming "{name}" to "{transientRoomName}"…
                                    </>
                                ) : (
                                    <>The room name will be publicly visible.</>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div
                            onDoubleClick={edit}
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
                        <ActionTextButton
                            disabled={isPersistingRoomName}
                            secondary
                            onClick={() => {
                                if (!selectedRoomId) {
                                    return
                                }

                                dispatch(
                                    RoomAction.setEditingName({
                                        roomId: selectedRoomId,
                                        state: false,
                                    })
                                )
                            }}
                        >
                            <Text>Cancel</Text>
                        </ActionTextButton>
                        <ActionTextButton disabled={isPersistingRoomName} type="submit">
                            <Text>Save</Text>
                        </ActionTextButton>
                    </div>
                ) : (
                    <>
                        <div
                            title={privacyDesc}
                            css={[
                                tw`
                                    flex
                                    items-center
                                    justify-center
                                    text-[#59799C]
                                    rounded-full
                                    uppercase
                                    w-10
                                    h-10
                                    mr-3
                                `,
                            ]}
                        >
                            <PrivacyIcon />
                        </div>
                        <div tw="flex min-w-[92px] justify-end">
                            {canEdit && !isRoomBeingDeleted && (
                                <ActionButton onClick={edit}>
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
                            <MoreActionButton
                                icon={<DeleteIcon />}
                                deleting={isRoomBeingDeleted}
                                active={roomMenuOpen}
                                tw="ml-3"
                                onClick={() => {
                                    if (!isRoomBeingDeleted) {
                                        setRoomMenuOpen((current) => !current)
                                    }
                                }}
                                ref={setMenuAnchorEl}
                            />
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
                                            if (selectedRoomId) {
                                                copy(selectedRoomId)

                                                success('Copied to clipboard.')
                                            }
                                            setRoomMenuOpen(false)
                                        }}
                                    >
                                        Copy room id
                                    </MenuButtonItem>
                                    <MenuButtonItem
                                        icon={
                                            <EyeIcon
                                                open={!isVisible}
                                                css={[
                                                    tw`
                                                        w-4
                                                    `,
                                                ]}
                                            />
                                        }
                                        onClick={() => {
                                            if (selectedRoomId && account) {
                                                dispatch(
                                                    RoomAction.setVisibility({
                                                        roomId: selectedRoomId,
                                                        owner: account,
                                                        visible: !isVisible,
                                                    })
                                                )
                                            }

                                            setRoomMenuOpen(false)
                                        }}
                                    >
                                        {isVisible ? <>Hide room</> : <>Unhide room</>}
                                    </MenuButtonItem>
                                    {isPinned && (
                                        <MenuButtonItem
                                            icon={
                                                <PinIcon
                                                    css={[
                                                        tw`
                                                            w-2.5
                                                        `,
                                                    ]}
                                                />
                                            }
                                            onClick={() => {
                                                if (selectedRoomId && account) {
                                                    dispatch(
                                                        RoomAction.unpin({
                                                            owner: account,
                                                            roomId: selectedRoomId,
                                                        })
                                                    )
                                                }

                                                setRoomMenuOpen(false)
                                            }}
                                        >
                                            Unpin
                                        </MenuButtonItem>
                                    )}
                                    {(canEdit || canDelete) && <MenuSeparatorItem />}
                                    {canEdit && (
                                        <MenuButtonItem
                                            icon={<GearIcon />}
                                            onClick={() => {
                                                if (typeof onRoomPropertiesClick === 'function') {
                                                    onRoomPropertiesClick()
                                                }

                                                setRoomMenuOpen(false)
                                            }}
                                        >
                                            Properties
                                        </MenuButtonItem>
                                    )}
                                    {canDelete && (
                                        <MenuButtonItem
                                            icon={<DeleteIcon />}
                                            onClick={() => {
                                                if (account && selectedRoomId) {
                                                    dispatch(RoomAction.delete(selectedRoomId))
                                                }

                                                setRoomMenuOpen(false)
                                            }}
                                        >
                                            Delete room
                                        </MenuButtonItem>
                                    )}
                                </Menu>
                            )}
                        </div>
                    </>
                )}
            </Form>
        </div>
    )
}
