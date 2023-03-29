import { HTMLAttributes, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import tw from 'twin.macro'
import useAbility from '$/hooks/useAbility'
import { RoomAction } from '$/features/room'
import {
    useEditingRoomName,
    useIsBeingDeleted,
    usePersistingRoomName,
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
import useJustInvited from '$/hooks/useJustInvited'
import { RoomId } from '$/features/room/types'
import useAnonAccount from '$/hooks/useAnonAccount'
import { MiscAction } from '$/features/misc'
import { ToastType } from '$/components/Toast'
import useAcceptInvite from '$/hooks/useAcceptInvite'
import useIsInviteBeingAccepted from '$/hooks/useIsInviteBeingAccepted'
import RoomInfo from '$/components/RoomInfo'
import UserIcon from '$/icons/UserIcon'
import i18n from '$/utils/i18n'

interface Props extends HTMLAttributes<HTMLDivElement> {
    canModifyMembers?: boolean
    onAddMemberClick?: () => void
    onEditMembersClick?: () => void
    onRoomPropertiesClick?: () => void
    onGoBackClick?: () => void
}

export default function ConversationHeader({
    canModifyMembers = false,
    onAddMemberClick,
    onEditMembersClick,
    onRoomPropertiesClick,
    onGoBackClick,
    ...props
}: Props) {
    const dispatch = useDispatch()

    const account = useWalletAccount()

    const selectedRoomId = useSelectedRoomId()

    const canEdit = !!useAbility(selectedRoomId, account, StreamPermission.EDIT)

    const canDelete = !!useAbility(selectedRoomId, account, StreamPermission.DELETE)

    const { name = '' } = useSelectedRoom() || {}

    const isRoomNameEditable = useEditingRoomName(selectedRoomId)

    const isPersistingRoomName = usePersistingRoomName(selectedRoomId)

    const transientRoomName = useTransientRoomName(selectedRoomId)

    const isRoomBeingDeleted = useIsBeingDeleted(selectedRoomId)

    const invitePending = useJustInvited(selectedRoomId, account)

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

    function onRenameSubmit() {
        if (!selectedRoomId || !account) {
            return
        }

        dispatch(
            RoomAction.rename({
                roomId: selectedRoomId,
                name: transientRoomName,
                requester: account,
                fingerprint: Flag.isPersistingRoomName(selectedRoomId),
            })
        )
    }

    useEffect(() => {
        if (!selectedRoomId) {
            return
        }

        dispatch(
            RoomAction.getPrivacy({
                roomId: selectedRoomId,
                fingerprint: Flag.isGettingPrivacy(selectedRoomId),
            })
        )
    }, [selectedRoomId])

    const isResending = useIsResending(selectedRoomId, account)

    const showProgress = isPersistingRoomName || isRoomBeingDeleted || isResending

    const isVisible = useIsRoomVisible(selectedRoomId)

    const isPinned = useIsRoomPinned(selectedRoomId)

    const acceptInvite = useAcceptInvite()

    const accepting = useIsInviteBeingAccepted()

    return (
        <div
            {...props}
            css={[
                tw`
                    relative
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
                        min-w-0
                        grow
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
                                        translate-y-[-0.06em]
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
                                placeholder={i18n('conversationHeader.roomNamePlaceholder')}
                                type="text"
                                value={transientRoomName}
                                disabled={isPersistingRoomName}
                            />
                            <div
                                css={[
                                    tw`
                                        flex
                                        items-center
                                        h-6
                                        text-[12px]
                                        lg:text-[14px]
                                        text-[#59799C]
                                    `,
                                ]}
                            >
                                <Text truncate>
                                    {isPersistingRoomName
                                        ? i18n(
                                              'conversationHeader.renamingInProgress',
                                              name,
                                              transientRoomName
                                          )
                                        : i18n('conversationHeader.renamingIdle')}
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
                                <Text truncate>
                                    {name || i18n('common.fallbackRoomName')}&zwnj;
                                </Text>
                            </div>
                            <RoomInfo roomId={selectedRoomId}>
                                <MemberCount
                                    roomId={selectedRoomId}
                                    canModifyMembers={canModifyMembers}
                                    onClick={() => void onEditMembersClick?.()}
                                />
                            </RoomInfo>
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
                            <Text>{i18n('common.cancel')}</Text>
                        </ActionTextButton>
                        <ActionTextButton disabled={isPersistingRoomName} type="submit">
                            <Text>{i18n('common.save')}</Text>
                        </ActionTextButton>
                    </div>
                ) : (
                    <>
                        {invitePending && (
                            <ActionTextButton
                                disabled={accepting}
                                onClick={() => void acceptInvite()}
                                css={tw`
                                    bg-[#FFF2EE]
                                    text-[#FF5924]
                                `}
                            >
                                <Text>{i18n('common.join', accepting)}</Text>
                            </ActionTextButton>
                        )}
                        {canEdit && !isRoomBeingDeleted && (
                            <ActionButton
                                onClick={edit}
                                css={tw`
                                    hidden
                                    lg:block
                                    ml-3
                                `}
                            >
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
                                            {i18n('common.addMember')}
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
                                            {i18n('common.editMembers')}
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
                                        {i18n('conversationHeader.renameRoom')}
                                    </MenuButtonItem>
                                )}
                                <MenuButtonItem
                                    icon={<CopyIcon />}
                                    onClick={() => {
                                        if (selectedRoomId) {
                                            copy(selectedRoomId)

                                            dispatch(
                                                MiscAction.toast({
                                                    title: i18n('common.copied'),
                                                    type: ToastType.Success,
                                                })
                                            )
                                        }
                                        setRoomMenuOpen(false)
                                    }}
                                >
                                    {i18n('common.copyRoomId')}
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
                                    {isVisible
                                        ? i18n('common.hideRoom')
                                        : i18n('common.unhideRoom')}
                                </MenuButtonItem>
                                {isPinned && (
                                    <MenuButtonItem
                                        icon={<PinIcon css={tw`w-2.5`} />}
                                        onClick={() => {
                                            if (selectedRoomId && account) {
                                                dispatch(
                                                    RoomAction.unpin({
                                                        roomId: selectedRoomId,
                                                        requester: account,
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
                                        {i18n('common.unpin')}
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
                                        {i18n('common.roomProperties')}
                                    </MenuButtonItem>
                                )}
                                {canDelete && (
                                    <MenuButtonItem
                                        icon={<DeleteIcon />}
                                        onClick={() => {
                                            if (account && selectedRoomId) {
                                                dispatch(
                                                    RoomAction.delete({
                                                        roomId: selectedRoomId,
                                                        requester: account,
                                                        fingerprint:
                                                            Flag.isRoomBeingDeleted(selectedRoomId),
                                                    })
                                                )
                                            }

                                            setRoomMenuOpen(false)
                                        }}
                                    >
                                        {i18n('common.deleteRoom')}
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

interface MemberCountProps {
    onClick: () => void
    canModifyMembers: boolean
    roomId: RoomId | undefined
}

function MemberCount({ roomId, onClick, canModifyMembers = false }: MemberCountProps) {
    const membersCount = useRoomMembers(roomId).length

    const isDetectingMembers = useIsDetectingRoomMembers(roomId)

    const canAnonSubscribe = useAbility(roomId, useAnonAccount(roomId), StreamPermission.SUBSCRIBE)

    if (canAnonSubscribe !== false) {
        return null
    }

    const count = (
        <div
            css={tw`
                flex
                items-center
            `}
        >
            <UserIcon
                width={12}
                height={undefined}
                css={tw`
                    shrink-0
                    md:hidden
                    mr-1
                `}
            />
            <Text css={tw`md:truncate`}>
                <span>{membersCount}</span>{' '}
                <span
                    css={tw`
                        hidden
                        md:inline
                    `}
                >
                    {i18n('common.member', membersCount !== 1)}
                </span>
            </Text>
        </div>
    )

    return (
        <>
            <Dot
                css={tw`
                    mx-2
                    shrink-0
                `}
            />
            {canModifyMembers ? (
                <button
                    type="button"
                    onClick={() => void onClick?.()}
                    css={[
                        tw`min-w-0`,
                        isDetectingMembers &&
                            tw`
                                animate-pulse
                                [animation-duration: 0.5s]
                            `,
                    ]}
                >
                    {count}
                </button>
            ) : (
                <div
                    css={[
                        tw`min-w-0`,
                        isDetectingMembers &&
                            tw`
                                animate-pulse
                                [animation-duration: 0.5s]
                            `,
                    ]}
                >
                    {count}
                </div>
            )}
        </>
    )
}
