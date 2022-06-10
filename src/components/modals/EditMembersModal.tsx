import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { Address } from '$/types'
import { MemberAction } from '$/features/member'
import { MembersAction } from '$/features/members'
import { useMembers, useMembersFetching } from '$/features/members/hooks'
import { usePrivacyOption, useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useCopy from '$/hooks/useCopy'
import useIsOnline from '$/hooks/useIsOnline'
import CopyIcon from '$/icons/CopyIcon'
import ExternalLinkIcon from '$/icons/ExternalLinkIcon'
import MoreIcon from '$/icons/MoreIcon'
import RemoveUserIcon from '$/icons/RemoveUserIcon'
import getExplorerURL from '$/utils/getExplorerURL'
import isSameAddress from '$/utils/isSameAddress'
import trunc from '$/utils/trunc'
import ActionButton from '../ActionButton'
import Avatar, { AvatarStatus } from '../Avatar'
import Menu, { MenuButtonItem, MenuLinkItem, MenuSeparatorItem } from '../Menu'
import Modal, { ModalProps } from './Modal'
import { useDelegatedAccount } from '$/features/delegation/hooks'
import Tag from '$/components/Tag'
import { StreamPermission } from 'streamr-client'
import Spinner from '$/components/Spinner'
import { useIsMemberBeingRemoved } from '$/features/member/hooks'

type MenuOpens = {
    [index: string]: boolean
}

type Props = ModalProps & {
    canModifyMembers?: boolean
}

export default function EditMembersModal({ open, canModifyMembers = false, ...props }: Props) {
    const menuOpenRef = useRef<MenuOpens>({})

    const [anyMenuOpen, setAnyMenuOpen] = useState<boolean>(false)

    const onMenuToggle = useCallback((address: Address, state: boolean) => {
        menuOpenRef.current[address] = state
        setAnyMenuOpen(Object.values(menuOpenRef.current).includes(true))
    }, [])

    const dispatch = useDispatch()

    const selectedRoomId = useSelectedRoomId()

    const onDeleteClick = useCallback(
        (address: Address) => {
            if (!selectedRoomId) {
                return
            }

            dispatch(
                MemberAction.remove({
                    roomId: selectedRoomId,
                    address,
                })
            )
        },
        [dispatch, selectedRoomId]
    )

    const members = useMembers(selectedRoomId)

    const isFetchingMembers = useMembersFetching(selectedRoomId)

    useEffect(() => {
        if (!open || !selectedRoomId) {
            return
        }

        dispatch(MembersAction.detect(selectedRoomId))
    }, [dispatch, selectedRoomId, open])

    const account = useWalletAccount()

    const delegatedAccount = useDelegatedAccount()

    const {
        icon: PrivacyIcon,
        desc: privacyDesc,
        label: privacyLabel,
    } = usePrivacyOption(selectedRoomId)

    return (
        <Modal {...props} open={open} title="Edit members">
            <div
                css={[
                    tw`
                        py-6
                        pr-6
                        bg-[#F7F9FC]
                        text-[#59799C]
                        flex
                        items-center
                        rounded-lg
                        mb-3
                    `,
                ]}
            >
                <div
                    css={[
                        tw`
                            w-[72px]
                        `,
                    ]}
                >
                    <PrivacyIcon tw="mx-auto" />
                </div>
                <div>
                    <p tw="text-[0.75rem]">
                        <strong>{privacyLabel} room</strong>
                        <br />
                        {privacyDesc}
                    </p>
                </div>
            </div>
            <div tw="relative">
                {anyMenuOpen && (
                    // If any item has its menu open we block list's scroll by covering it
                    // with a thin layer of unscrollable div.
                    <div
                        css={[
                            tw`
                                absolute
                                h-full
                                w-full
                                z-10
                            `,
                        ]}
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
                        isFetchingMembers &&
                            tw`
                                bg-[#F7F9FC]
                            `,
                    ]}
                >
                    {isFetchingMembers ? (
                        <div
                            css={[
                                tw`
                                    flex
                                    flex-col
                                    h-full
                                    justify-center
                                `,
                            ]}
                        >
                            <div>
                                <div
                                    css={[
                                        tw`
                                            w-6
                                            h-6
                                            relative
                                            mx-auto
                                            mb-1
                                        `,
                                    ]}
                                >
                                    <Spinner />
                                </div>
                                <p
                                    css={[
                                        tw`
                                            text-[#59799C]
                                            uppercase
                                            text-[0.625rem]
                                            font-medium
                                            text-center
                                        `,
                                    ]}
                                >
                                    Loading…
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {members.map(({ address, permissions }) => (
                                <Item
                                    key={address}
                                    onMenuToggle={onMenuToggle}
                                    address={address}
                                    canBeDeleted={canModifyMembers}
                                    onDeleteClick={onDeleteClick}
                                    isCurrentAccount={isSameAddress(address, account)}
                                    isCurrentDelegatedAccount={isSameAddress(
                                        address,
                                        delegatedAccount
                                    )}
                                    permissions={permissions}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </Modal>
    )
}

type ItemProps = HTMLAttributes<HTMLDivElement> & {
    address: string
    onMenuToggle?: (address: Address, state: boolean) => void
    canBeDeleted?: boolean
    onDeleteClick?: (address: Address) => void
    isCurrentAccount?: boolean
    isCurrentDelegatedAccount?: boolean
    permissions: StreamPermission[]
}

function Item({
    address,
    onMenuToggle,
    canBeDeleted,
    onDeleteClick,
    isCurrentAccount = false,
    isCurrentDelegatedAccount = false,
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

    const status = useIsOnline(address) ? AvatarStatus.Online : AvatarStatus.Offline

    const justInvited = permissions.length === 1 && permissions[0] === StreamPermission.GRANT

    const selectedRoomId = useSelectedRoomId()

    const isBeingRemoved = useIsMemberBeingRemoved(selectedRoomId, address)

    return (
        <div
            css={[
                tw`
                    h-[96px]
                    bg-[#F1F4F7]
                    rounded-lg
                    relative
                `,
            ]}
        >
            <div
                css={[
                    tw`
                        absolute
                        top-0
                        left-1/2
                        -translate-y-1/4
                        -translate-x-1/2
                        flex
                        [* + *]:ml-1
                    `,
                ]}
            >
                {justInvited && <Tag>Invite pending</Tag>}
                {isCurrentAccount && <Tag>You</Tag>}
                {isCurrentDelegatedAccount && <Tag>Your delegated account</Tag>}
            </div>
            <div
                {...props}
                css={[
                    tw`
                        h-full
                        flex
                        items-center
                    `,
                ]}
            >
                <div
                    css={[
                        tw`
                            h-full
                            flex
                            items-center
                            flex-shrink-0
                            justify-center
                            w-[72px]
                        `,
                    ]}
                >
                    <Avatar account={address} backgroundColor="white" status={status} />
                </div>
                <div
                    css={[
                        tw`
                            flex-grow
                        `,
                    ]}
                >
                    <div
                        css={[
                            tw`
                                text-[1.125rem]
                                font-medium
                            `,
                        ]}
                    >
                        {trunc(address)}
                    </div>
                </div>
                <div
                    css={[
                        tw`
                            h-full
                            flex
                            items-center
                            flex-shrink-0
                            justify-center
                            w-[72px]
                        `,
                    ]}
                >
                    <ActionButton
                        active={memberMenuOpen || isBeingRemoved}
                        light
                        onClick={() => {
                            if (!isBeingRemoved) {
                                setMemberMenuOpen((current) => !current)
                            }
                        }}
                        ref={setMenuAnchorEl}
                    >
                        {isBeingRemoved ? (
                            <>
                                <Spinner r={20} strokeWidth={1} />
                                <div
                                    css={[
                                        tw`
                                            flex
                                            items-center
                                            justify-center
                                            w-10
                                            h-10
                                        `,
                                    ]}
                                >
                                    <RemoveUserIcon
                                        css={[
                                            tw`
                                                w-4
                                                h-4
                                                translate-x-[1px]
                                                translate-y-[-1px]
                                            `,
                                        ]}
                                    />
                                </div>
                            </>
                        ) : (
                            <MoreIcon />
                        )}
                    </ActionButton>
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
                                View on explorer
                            </MenuLinkItem>
                            <MenuButtonItem
                                icon={<CopyIcon />}
                                onClick={() => {
                                    copy(address)
                                    setMemberMenuOpen(false)
                                }}
                            >
                                Copy address
                            </MenuButtonItem>
                            {canBeDeleted && !isCurrentAccount && (
                                <>
                                    <MenuSeparatorItem />
                                    <MenuButtonItem
                                        icon={
                                            <RemoveUserIcon
                                                css={[
                                                    tw`
                                                    w-4
                                                    h-4
                                                `,
                                                ]}
                                            />
                                        }
                                        onClick={() => {
                                            if (typeof onDeleteClick === 'function') {
                                                onDeleteClick(address)
                                            }

                                            setMemberMenuOpen(false)
                                        }}
                                    >
                                        Delete member
                                    </MenuButtonItem>
                                </>
                            )}
                        </Menu>
                    )}
                </div>
            </div>
        </div>
    )
}
