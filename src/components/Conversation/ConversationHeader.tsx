import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import tw from 'twin.macro'
import useCurrentAbility from '$/hooks/useCurrentAbility'
import useLoadCurrentAbilityEffect from '$/hooks/useLoadCurrentAbilityEffect'
import { RoomAction } from '$/features/room'
import {
    useEditingRoomName,
    useIsBeingDeleted,
    usePersistingRoomName,
    usePrivacyOption,
    useSelectedRoomId,
    useTransientRoomName,
} from '$/features/room/hooks'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
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
import { Flag } from '$/features/flag/types'
import { FlagAction } from '$/features/flag'
import EditIcon from '$/icons/EditIcon'
import useIsResending from '$/hooks/useIsResending'
import Dot from '$/components/Dot'
import useRoomMembers from '$/hooks/useRoomMembers'
import useIsDetectingRoomMembers from '$/hooks/useIsDetectingRoomMembers'
import ArrowIcon from '$/icons/ArrowIcon'

type Props = {
    canModifyMembers?: boolean
    onAddMemberClick?: () => void
    onEditMembersClick?: () => void
    onRoomPropertiesClick?: () => void
    onGoBackClick?: () => void
}

function formatMembersCount(value: number) {
    if (value !== 1) {
        return `${value} members`
    }

    return '1 member'
}

export default function ConversationHeader({
    canModifyMembers = false,
    onAddMemberClick,
    onEditMembersClick,
    onRoomPropertiesClick,
    onGoBackClick,
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
            dispatch(FlagAction.set(Flag.isRoomNameBeingEdited(selectedRoomId)))
        }
    }

    useEffect(() => {
        if (!selectedRoomId) {
            return
        }

        if (!canEdit) {
            dispatch(FlagAction.unset(Flag.isRoomNameBeingEdited(selectedRoomId)))
        }
    }, [canEdit, selectedRoomId])

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Escape' && selectedRoomId) {
            dispatch(FlagAction.unset(Flag.isRoomNameBeingEdited(selectedRoomId)))
        }
    }

    const [roomMenuOpen, setRoomMenuOpen] = useState<boolean>(false)

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null)

    const { copy } = useCopy()

    const account = useWalletAccount()

    const streamrClient = useWalletClient()

    function onRenameSubmit() {
        if (!selectedRoomId || !provider || !account || !streamrClient) {
            return
        }

        dispatch(
            RoomAction.rename({
                roomId: selectedRoomId,
                name: transientRoomName,
                provider,
                requester: account,
                streamrClient,
                fingerprint: Flag.isPersistingRoomName(selectedRoomId),
            })
        )
    }

    const { icon: PrivacyIcon, label: privacyLabel } = usePrivacyOption(selectedRoomId)

    useEffect(() => {
        if (!selectedRoomId || !streamrClient) {
            return
        }

        dispatch(
            RoomAction.getPrivacy({
                roomId: selectedRoomId,
                streamrClient,
                fingerprint: Flag.isGettingPrivacy(selectedRoomId),
            })
        )
    }, [selectedRoomId])

    const isResending = useIsResending(selectedRoomId, account)

    const showProgress = isPersistingRoomName || isRoomBeingDeleted || isResending

    const isVisible = useIsRoomVisible(selectedRoomId)

    const isPinned = useIsRoomPinned(selectedRoomId)

    const provider = useWalletProvider()

    const membersCount = useRoomMembers(selectedRoomId).length

    const isDetectingMembers = useIsDetectingRoomMembers(selectedRoomId)

    return (
        <div
            css={[
                tw`
                    absolute
                    left-0
                    top-0
                    h-[72px]
                    lg:h-[92px]
                    w-full
                `,
            ]}
        >
            <LoadingIndicator
                css={tw`
                    absolute
                    bottom-0
                    left-0
                    w-full
                `}
                state={showProgress ? LoadingState.Busy : undefined}
            />
            <Form
                css={[
                    tw`
                        flex
                        items-center
                        px-4
                        lg:px-6
                        shadow-[inset 0 -1px 0 #dee6ee]
                        w-full
                        h-full
                    `,
                ]}
                onSubmit={onRenameSubmit}
            >
                <ActionButton
                    css={tw`
                        shrink-0
                        block
                        lg:hidden
                        mr-4
                    `}
                    onClick={onGoBackClick}
                >
                    <ArrowIcon />
                </ActionButton>
                <div
                    css={tw`
                        grow
                        min-w-0
                    `}
                >
                    {isRoomNameEditable ? (
                        <div>
                            <input
                                css={[
                                    tw`
                                        leading-normal
                                        text-black
                                        font-medium
                                        appearance-none
                                        border-0
                                        outline-none
                                        p-0
                                        w-full
                                        text-[20px]
                                        lg:text-[26px]
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
                                        text-[12px]
                                        lg:text-[14px]
                                        text-[#59799C]
                                    `,
                                ]}
                            >
                                <Text truncate>
                                    {isPersistingRoomName ? (
                                        <>
                                            Renaming "{name}" to "{transientRoomName}"…
                                        </>
                                    ) : (
                                        <>The room name will be publicly visible.</>
                                    )}
                                </Text>
                            </div>
                        </div>
                    ) : (
                        <div onDoubleClick={edit}>
                            <div
                                css={[
                                    tw`
                                        text-[20px]
                                        lg:text-[26px]
                                        font-medium
                                        select-none
                                        leading-normal
                                    `,
                                ]}
                            >
                                <div css={tw`truncate`}>{name || 'Unnamed room'}&zwnj;</div>
                            </div>
                            <div
                                css={[
                                    tw`
                                        flex
                                        items-center
                                        text-[#59799C]
                                        text-[12px]
                                        lg:text-[14px]
                                    `,
                                ]}
                            >
                                <PrivacyIcon
                                    css={tw`
                                        w-3
                                        mr-1.5
                                        ml-0.5
                                    `}
                                />
                                <Text>{privacyLabel} room</Text>
                                <Dot css={tw`mx-2`} />
                                {canModifyMembers ? (
                                    <button
                                        type="button"
                                        onClick={() => void onEditMembersClick?.()}
                                    >
                                        <Text
                                            css={
                                                isDetectingMembers &&
                                                tw`
                                                    animate-pulse
                                                    [animation-duration: 0.5s]
                                                `
                                            }
                                        >
                                            {formatMembersCount(membersCount)}
                                        </Text>
                                    </button>
                                ) : (
                                    <Text
                                        css={
                                            isDetectingMembers &&
                                            tw`
                                                animate-pulse
                                                [animation-duration: 0.5s]
                                            `
                                        }
                                    >
                                        {formatMembersCount(membersCount)}
                                    </Text>
                                )}
                            </div>
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
                                    FlagAction.unset(Flag.isRoomNameBeingEdited(selectedRoomId))
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
                        {canEdit && !isRoomBeingDeleted && (
                            <ActionButton onClick={edit} css={tw`hidden lg:block`}>
                                <EditIcon />
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
                                {canEdit && !isRoomBeingDeleted && (
                                    <MenuButtonItem
                                        icon={<EditIcon />}
                                        onClick={() => {
                                            edit()
                                            setRoomMenuOpen(false)
                                        }}
                                        css={tw`lg:hidden`}
                                    >
                                        Rename room
                                    </MenuButtonItem>
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
                                    icon={<EyeIcon open={!isVisible} css={tw`w-4`} />}
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
                                            if (selectedRoomId && account && streamrClient) {
                                                dispatch(
                                                    RoomAction.unpin({
                                                        roomId: selectedRoomId,
                                                        requester: account,
                                                        streamrClient,
                                                        fingerprint: Flag.isRoomBeingUnpinned(
                                                            selectedRoomId,
                                                            account
                                                        ),
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
                                            if (
                                                account &&
                                                selectedRoomId &&
                                                provider &&
                                                streamrClient
                                            ) {
                                                dispatch(
                                                    RoomAction.delete({
                                                        roomId: selectedRoomId,
                                                        provider,
                                                        requester: account,
                                                        streamrClient,
                                                        fingerprint:
                                                            Flag.isRoomBeingDeleted(selectedRoomId),
                                                    })
                                                )
                                            }

                                            setRoomMenuOpen(false)
                                        }}
                                    >
                                        Delete room
                                    </MenuButtonItem>
                                )}
                            </Menu>
                        )}
                    </>
                )}
            </Form>
        </div>
    )
}
