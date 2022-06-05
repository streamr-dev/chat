import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { Address } from '../../../types/common'
import { MemberAction } from '../../features/member'
import { MembersAction } from '../../features/members'
import { useMembers } from '../../features/members/hooks'
import { useSelectedRoomId } from '../../features/room/hooks'
import { useWalletAccount } from '../../features/wallet/hooks'
import useCopy from '../../hooks/useCopy'
import useIsOnline from '../../hooks/useIsOnline'
import CopyIcon from '../../icons/CopyIcon'
import ExternalLinkIcon from '../../icons/ExternalLinkIcon'
import MoreIcon from '../../icons/MoreIcon'
import RemoveUserIcon from '../../icons/RemoveUserIcon'
import getExplorerURL from '../../utils/getExplorerURL'
import isSameAddress from '../../utils/isSameAddress'
import trunc from '../../utils/trunc'
import ActionButton from '../ActionButton'
import Avatar, { AvatarStatus } from '../Avatar'
import Menu, { MenuButtonItem, MenuLinkItem, MenuSeparatorItem } from '../Menu'
import Modal, { ModalProps } from './Modal'

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
                MemberAction.setPermissions({
                    roomId: selectedRoomId,
                    address,
                    permissions: [],
                })
            )
        },
        [dispatch, selectedRoomId]
    )

    const members = useMembers(selectedRoomId)

    useEffect(() => {
        if (!open || !selectedRoomId) {
            return
        }

        dispatch(MembersAction.detect(selectedRoomId))
    }, [dispatch, selectedRoomId, open])

    const account = useWalletAccount()

    return (
        <Modal {...props} open={open} title="Edit members">
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
                            [> * + *]:mt-4
                        `,
                    ]}
                >
                    {members.map((address) => (
                        <Item
                            key={address}
                            onMenuToggle={onMenuToggle}
                            address={address}
                            canBeDeleted={canModifyMembers && !isSameAddress(account, address)}
                            onDeleteClick={onDeleteClick}
                        />
                    ))}
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
}

function Item({ address, onMenuToggle, canBeDeleted, onDeleteClick, ...props }: ItemProps) {
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

    return (
        <div
            {...props}
            css={[
                tw`
                    bg-[#F1F4F7]
                    h-[96px]
                    rounded-lg
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
                        text-[1.125rem]
                        font-medium
                    `,
                ]}
            >
                {trunc(address)}
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
                    active={memberMenuOpen}
                    light
                    onClick={() => void setMemberMenuOpen((current) => !current)}
                    ref={setMenuAnchorEl}
                >
                    <MoreIcon />
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
                        {canBeDeleted && (
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
    )
}
