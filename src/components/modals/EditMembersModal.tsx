import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { Address } from '$/types'
import { MemberAction } from '$/features/member'
import { useMembers, useMembersFetching } from '$/features/members/hooks'
import { usePrivacyOption, useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import useCopy from '$/hooks/useCopy'
import CopyIcon from '$/icons/CopyIcon'
import ExternalLinkIcon from '$/icons/ExternalLinkIcon'
import RemoveUserIcon from '$/icons/RemoveUserIcon'
import getExplorerURL from '$/utils/getExplorerURL'
import isSameAddress from '$/utils/isSameAddress'
import Avatar, { AvatarStatus } from '../Avatar'
import Menu, { MenuButtonItem, MenuLinkItem, MenuSeparatorItem } from '../Menu'
import Modal, { ModalProps } from './Modal'
import { useDelegatedAccount } from '$/features/delegation/hooks'
import Tag from '$/components/Tag'
import { StreamPermission } from 'streamr-client'
import Spinner from '$/components/Spinner'
import { useIsMemberBeingRemoved } from '$/features/member/hooks'
import { success } from '$/utils/toaster'
import MoreActionButton from '$/components/MoreActionButton'
import { useAlias } from '$/features/alias/hooks'
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

    const provider = useWalletProvider()

    const requester = useWalletAccount()

    const streamrClient = useWalletClient()

    const onDeleteClick = useCallback(
        (member: Address) => {
            if (!selectedRoomId || !provider || !requester || !streamrClient) {
                return
            }

            dispatch(
                MemberAction.remove({
                    roomId: selectedRoomId,
                    member,
                    provider,
                    requester,
                    streamrClient,
                    fingerprint: Flag.isMemberBeingRemoved(selectedRoomId, member),
                })
            )
        },
        [dispatch, selectedRoomId, provider, requester, streamrClient]
    )

    const members = useMembers(selectedRoomId)

    const isFetchingMembers = useMembersFetching(selectedRoomId)

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
                            {members.map(({ address, permissions, isMainAccount }) => (
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
                                    isMainAccount={isMainAccount}
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
    isMainAccount: boolean
}

function Item({
    address,
    onMenuToggle,
    canBeDeleted,
    onDeleteClick,
    isCurrentAccount = false,
    isCurrentDelegatedAccount = false,
    isMainAccount = false,
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
                    <Avatar
                        seed={address.toLowerCase()}
                        backgroundColor="white"
                        status={AvatarStatus.Offline}
                    />
                </div>
                <div
                    css={[
                        tw`
                            flex-grow
                            min-w-0
                        `,
                    ]}
                >
                    <div
                        css={[
                            tw`
                                flex
                                items-center
                                h-[28px]
                                w-full
                            `,
                        ]}
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
                                css={[
                                    tw`
                                        text-[1.125rem]
                                        placeholder:text-[#DEE6EE]
                                        border
                                        border-[#DEE6EE]
                                        rounded-lg
                                        w-[90%]
                                        px-3
                                        outline-none
                                        focus:border-[#59799C]
                                    `,
                                ]}
                            />
                        ) : (
                            <div
                                onDoubleClick={editAlias}
                                css={[
                                    tw`
                                        text-[1.125rem]
                                        font-medium
                                        truncate
                                    `,
                                ]}
                            >
                                {alias || displayName}
                            </div>
                        )}
                    </div>
                    <div
                        css={[
                            tw`
                                text-[#59799C]
                                text-[0.875rem]
                            `,
                        ]}
                    >
                        {isAddingNickname ? (
                            <div css={[tw``]}>
                                <Text>Nickname is only visible to you</Text>
                            </div>
                        ) : (
                            <div>
                                <Text>
                                    {isCurrentAccount ? (
                                        <>You</>
                                    ) : (
                                        <>
                                            {isCurrentDelegatedAccount ? (
                                                <>Your delegated account</>
                                            ) : (
                                                <>
                                                    {isMainAccount ? '[Main Account] ' : null}
                                                    Room member
                                                </>
                                            )}
                                        </>
                                    )}
                                </Text>
                            </div>
                        )}
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
                    {isAddingNickname ? (
                        <ActionButton type="submit" light>
                            <CheckIcon tw="w-10" />
                        </ActionButton>
                    ) : (
                        <MoreActionButton
                            icon={
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
                                View on explorer
                            </MenuLinkItem>
                            <MenuButtonItem
                                icon={<CopyIcon />}
                                onClick={() => {
                                    copy(address)
                                    setMemberMenuOpen(false)
                                    success('Copied to clipboard.')
                                }}
                            >
                                Copy address
                            </MenuButtonItem>
                            <MenuSeparatorItem />
                            <MenuButtonItem
                                icon={<EditIcon />}
                                onClick={() => {
                                    editAlias()

                                    setMemberMenuOpen(false)
                                }}
                            >
                                {alias ? <>Edit nickname</> : <>Set nickname</>}
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
        </Form>
    )
}
