import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { Address, PrivacySetting } from '$/types'
import { PermissionsAction } from '$/features/permissions'
import useRoomMembers from '$/hooks/useRoomMembers'
import useIsDetectingRoomMembers from '$/hooks/useIsDetectingRoomMembers'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useCopy from '$/hooks/useCopy'
import CopyIcon from '$/icons/CopyIcon'
import ExternalLinkIcon from '$/icons/ExternalLinkIcon'
import RemoveUserIcon from '$/icons/RemoveUserIcon'
import getExplorerURL from '$/utils/getExplorerURL'
import isSameAddress from '$/utils/isSameAddress'
import Avatar, { AvatarStatus } from '../Avatar'
import Menu, { MenuButtonItem, MenuLinkItem, MenuSeparatorItem } from '../Menu'
import Modal, { Props } from './Modal'
import { useDelegatedAccount } from '$/features/delegation/hooks'
import Tag from '$/components/Tag'
import { StreamPermission } from '@streamr/sdk'
import Spinner from '$/components/Spinner'
import useIsMemberBeingRemoved from '$/hooks/useIsMemberBeingRemoved'
import MoreActionButton from '$/components/MoreActionButton'
import useAlias from '$/hooks/useAlias'
import ActionButton from '$/components/ActionButton'
import Text from '$/components/Text'
import CheckIcon from '$/icons/CheckIcon'
import { AliasAction } from '$/features/alias'
import focus from '$/utils/focus'
import Form from '$/components/Form'
import { Flag } from '$/features/flag/types'
import EditIcon from '$/icons/EditIcon'
import useENSName from '$/hooks/useENSName'
import trunc from '$/utils/trunc'
import { AccountType } from '$/utils/getAccountType'
import useCanGrant from '$/hooks/useCanGrant'
import { MiscAction } from '$/features/misc'
import { ToastType } from '$/components/Toast'
import i18n from '$/utils/i18n'
import usePrivacy from '$/hooks/usePrivacy'

export default function EditMembersModal({
    title = i18n('editMembersModal.title'),
    ...props
}: Props) {
    const menuOpenRef = useRef<Record<string, boolean>>({})

    const canGrant = useCanGrant()

    const [anyMenuOpen, setAnyMenuOpen] = useState<boolean>(false)

    const onMenuToggle = useCallback((address: Address, state: boolean) => {
        menuOpenRef.current[address] = state
        setAnyMenuOpen(Object.values(menuOpenRef.current).includes(true))
    }, [])

    const dispatch = useDispatch()

    const selectedRoomId = useSelectedRoomId()

    const requester = useWalletAccount()

    const onDeleteClick = useCallback(
        (member: Address) => {
            if (!selectedRoomId || !requester) {
                return
            }

            dispatch(
                PermissionsAction.removeMember({
                    roomId: selectedRoomId,
                    member,
                    requester,
                    fingerprint: Flag.isMemberBeingRemoved(selectedRoomId, member),
                })
            )
        },
        [dispatch, selectedRoomId, requester]
    )

    const members = useRoomMembers(selectedRoomId)

    const isDetectingRoomMembers = useIsDetectingRoomMembers(selectedRoomId)

    const account = useWalletAccount()

    const delegatedAccount = useDelegatedAccount()

    const privacy = usePrivacy(selectedRoomId, PrivacySetting.Private)

    const PrivacyIcon = i18n('common.roomPrivacyIcon', privacy)

    return (
        <Modal {...props} title={title}>
            <div
                css={tw`
                    py-4
                    md:py-6
                    pr-6
                    bg-[#F7F9FC]
                    text-[#59799C]
                    flex
                    items-center
                    rounded-lg
                    mb-3
                `}
            >
                <div css={tw`w-[72px]`}>
                    <PrivacyIcon css={tw`mx-auto`} />
                </div>
                <div>
                    <p css={tw`text-[0.75rem]`}>
                        <strong>{i18n('common.roomPrivacyLabel', privacy)} room</strong>
                        <br />
                        {i18n('common.roomPrivacyDesc', privacy)}
                    </p>
                </div>
            </div>
            <div css={tw`relative`}>
                {anyMenuOpen && (
                    // If any item has its menu open we block list's scroll by covering it
                    // with a thin layer of unscrollable div.
                    <div
                        css={tw`
                            absolute
                            h-full
                            w-full
                            z-10
                        `}
                    />
                )}
                <div
                    css={[
                        tw`
                            h-[320px]
                            overflow-auto
                            py-1
                            box-content
                            [> * + *]:mt-4
                        `,
                        isDetectingRoomMembers && tw`bg-[#F7F9FC]`,
                    ]}
                >
                    {isDetectingRoomMembers ? (
                        <div
                            css={tw`
                                flex
                                flex-col
                                h-full
                                justify-center
                            `}
                        >
                            <div>
                                <div
                                    css={tw`
                                        w-6
                                        h-6
                                        relative
                                        mx-auto
                                        mb-1
                                    `}
                                >
                                    <Spinner />
                                </div>
                                <p
                                    css={tw`
                                        text-[#59799C]
                                        uppercase
                                        text-[0.625rem]
                                        font-medium
                                        text-center
                                    `}
                                >
                                    Loading…
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {members.map(({ address, permissions, accountType }) => (
                                <Item
                                    key={address}
                                    onMenuToggle={onMenuToggle}
                                    address={address}
                                    canBeDeleted={canGrant}
                                    onDeleteClick={onDeleteClick}
                                    isCurrentAccount={isSameAddress(address, account)}
                                    isCurrentDelegatedAccount={isSameAddress(
                                        address,
                                        delegatedAccount
                                    )}
                                    permissions={permissions}
                                    accountType={accountType}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </Modal>
    )
}

EditMembersModal.displayName = 'EditMembersModal'

interface ItemProps extends HTMLAttributes<HTMLDivElement> {
    address: string
    onMenuToggle?: (address: Address, state: boolean) => void
    canBeDeleted?: boolean
    onDeleteClick?: (address: Address) => void
    isCurrentAccount?: boolean
    isCurrentDelegatedAccount?: boolean
    permissions: StreamPermission[]
    accountType: AccountType
}

function Item({
    address,
    onMenuToggle,
    canBeDeleted,
    onDeleteClick,
    isCurrentAccount = false,
    isCurrentDelegatedAccount = false,
    accountType = AccountType.Unset,
    permissions,
    ...props
}: ItemProps) {
    const [memberMenuOpen, setMemberMenuOpen] = useState<boolean>(false)

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null)

    const onMenuToggleRef = useRef(onMenuToggle)

    useEffect(() => {
        onMenuToggleRef.current = onMenuToggle
    }, [onMenuToggle])

    useEffect(() => {
        if (typeof onMenuToggleRef.current === 'function') {
            onMenuToggleRef.current(address, memberMenuOpen)
        }
    }, [address, memberMenuOpen])

    const { copy } = useCopy()

    const justInvited = permissions.length === 1 && permissions[0] === StreamPermission.GRANT

    const selectedRoomId = useSelectedRoomId()

    const isBeingRemoved = useIsMemberBeingRemoved(selectedRoomId, address)

    const owner = useWalletAccount()

    const displayName = useENSName(address) || trunc(address)

    const alias = useAlias(address)

    const [isAddingNickname, setIsAddingNickname] = useState<boolean>(false)

    const [nickname, setNickname] = useState<string>('')

    const dispatch = useDispatch()

    function editAlias() {
        setNickname(alias || '')
        setIsAddingNickname(true)
    }

    const [input, setInput] = useState<HTMLInputElement | null>(null)

    useEffect(() => {
        focus(input)
    }, [input])

    return (
        <Form
            onSubmit={() => {
                if (isAddingNickname && owner) {
                    dispatch(
                        AliasAction.set({
                            owner,
                            address,
                            value: nickname,
                        })
                    )
                }

                setIsAddingNickname(false)
            }}
            css={tw`
                h-20
                md:h-[96px]
                bg-[#F1F4F7]
                rounded-lg
                relative
            `}
        >
            <div
                css={tw`
                    absolute
                    top-0
                    left-1/2
                    -translate-y-1/4
                    -translate-x-1/2
                    flex
                    [* + *]:ml-1
                `}
            >
                {justInvited && <Tag>{i18n('common.invitePending')}</Tag>}
            </div>
            <div
                {...props}
                css={tw`
                    h-full
                    flex
                    items-center
                `}
            >
                <div
                    css={tw`
                        h-full
                        flex
                        items-center
                        shrink-0
                        justify-center
                        w-[72px]
                    `}
                >
                    <Avatar
                        seed={address.toLowerCase()}
                        backgroundColor="white"
                        status={AvatarStatus.Offline}
                    />
                </div>
                <div
                    css={tw`
                        grow
                        min-w-0
                    `}
                >
                    <div
                        css={tw`
                            flex
                            items-center
                            h-[28px]
                            w-full
                        `}
                    >
                        {isAddingNickname ? (
                            <input
                                ref={(el) => void setInput(el)}
                                type="text"
                                value={nickname}
                                placeholder={displayName}
                                onChange={(e) => void setNickname(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setIsAddingNickname(false)
                                        e.stopPropagation()
                                    }
                                }}
                                css={tw`
                                    text-[1rem]
                                    md:text-[1.125rem]
                                    placeholder:text-[#DEE6EE]
                                    border
                                    border-[#DEE6EE]
                                    rounded-lg
                                    w-[90%]
                                    px-3
                                    outline-none
                                    focus:border-[#59799C]
                                `}
                            />
                        ) : (
                            <div
                                onDoubleClick={editAlias}
                                css={tw`
                                    text-[1rem]
                                    md:text-[1.125rem]
                                    font-medium
                                    truncate
                                `}
                            >
                                {alias || displayName}
                            </div>
                        )}
                    </div>
                    <div
                        css={tw`
                            text-[#59799C]
                            text-[0.875rem]
                        `}
                    >
                        {isAddingNickname ? (
                            <div>
                                <Text>{i18n('editMembersModal.nicknameVisibilityNote')}</Text>
                            </div>
                        ) : (
                            <div>
                                <Text>
                                    {isCurrentAccount
                                        ? i18n('editMembersModal.currentAccountLabel')
                                        : isCurrentDelegatedAccount
                                        ? i18n('editMembersModal.currentHotAccountLabel')
                                        : i18n('editMembersModal.accountType', accountType)}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
                <div
                    css={tw`
                        h-full
                        flex
                        items-center
                        shrink-0
                        justify-center
                        w-[72px]
                    `}
                >
                    {isAddingNickname ? (
                        <ActionButton type="submit" light>
                            <CheckIcon css={tw`w-10`} />
                        </ActionButton>
                    ) : (
                        <MoreActionButton
                            icon={
                                <RemoveUserIcon
                                    css={tw`
                                        w-4
                                        h-4
                                        translate-x-[1px]
                                        translate-y-[-1px]
                                    `}
                                />
                            }
                            deleting={isBeingRemoved}
                            active={memberMenuOpen}
                            light
                            onClick={() => {
                                if (!isBeingRemoved) {
                                    setMemberMenuOpen((current) => !current)
                                }
                            }}
                            ref={setMenuAnchorEl}
                        />
                    )}
                    {memberMenuOpen && (
                        <Menu
                            anchorEl={menuAnchorEl}
                            onMouseDownOutside={() => void setMemberMenuOpen(false)}
                        >
                            <MenuLinkItem
                                href={getExplorerURL(address)}
                                icon={<ExternalLinkIcon />}
                                onClick={() => void setMemberMenuOpen(false)}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {i18n('common.viewOnExplorer')}
                            </MenuLinkItem>
                            <MenuButtonItem
                                icon={<CopyIcon />}
                                onClick={() => {
                                    copy(address)

                                    setMemberMenuOpen(false)

                                    dispatch(
                                        MiscAction.toast({
                                            title: i18n('common.copied'),
                                            type: ToastType.Success,
                                        })
                                    )
                                }}
                            >
                                {i18n('accountModal.copy')}
                            </MenuButtonItem>
                            <MenuSeparatorItem />
                            <MenuButtonItem
                                icon={<EditIcon />}
                                onClick={() => {
                                    editAlias()

                                    setMemberMenuOpen(false)
                                }}
                            >
                                {alias
                                    ? i18n('editMembersModal.editNicknameLabel')
                                    : i18n('editMembersModal.setNicknameLabel')}
                            </MenuButtonItem>
                            {canBeDeleted && !isCurrentAccount && (
                                <>
                                    <MenuSeparatorItem />
                                    <MenuButtonItem
                                        icon={
                                            <RemoveUserIcon
                                                css={tw`
                                                    w-4
                                                    h-4
                                                `}
                                            />
                                        }
                                        onClick={() => {
                                            if (typeof onDeleteClick === 'function') {
                                                onDeleteClick(address)
                                            }

                                            setMemberMenuOpen(false)
                                        }}
                                    >
                                        {i18n('editMembersModal.deleteMemberLabel')}
                                    </MenuButtonItem>
                                </>
                            )}
                        </Menu>
                    )}
                </div>
            </div>
        </Form>
    )
}
