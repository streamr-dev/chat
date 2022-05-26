import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import tw from 'twin.macro'
import useCopy from '../hooks/useCopy'
import CopyIcon from '../icons/CopyIcon'
import DeleteIcon from '../icons/DeleteIcon'
import ExternalLinkIcon from '../icons/ExternalLinkIcon'
import MoreIcon from '../icons/MoreIcon'
import getExplorerURL from '../utils/getExplorerURL'
import trunc from '../utils/trunc'
import ActionButton from './ActionButton'
import Avatar from './Avatar'
import Menu, { MenuButtonItem, MenuLinkItem, MenuSeparatorItem } from './Menu'
import Modal, { ModalProps } from './Modal'

type MenuOpens = {
    [index: string]: boolean
}

export default function EditMembersModal(props: ModalProps) {
    const menuOpenRef = useRef<MenuOpens>({})

    const [anyMenuOpen, setAnyMenuOpen] = useState<boolean>(false)

    const onMenuToggle = useCallback((address: string, state: boolean) => {
        menuOpenRef.current[address] = state
        setAnyMenuOpen(Object.values(menuOpenRef.current).includes(true))
    }, [])

    return (
        <Modal {...props} title="Edit members">
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
                    <Item
                        onMenuToggle={onMenuToggle}
                        address="0x1bcabcabcabcabcabcabcabcabcabcbcabcbcabc"
                    />
                    <Item
                        onMenuToggle={onMenuToggle}
                        address="0x2bcabcabcabcabcabcabcabcabcabcbcabcbcabc"
                    />
                    <Item
                        onMenuToggle={onMenuToggle}
                        address="0x3bcabcabcabcabcabcabcabcabcabcbcabcbcabc"
                    />
                    <Item
                        onMenuToggle={onMenuToggle}
                        address="0x4bcabcabcabcabcabcabcabcabcabcbcabcbcabc"
                    />
                    <Item
                        onMenuToggle={onMenuToggle}
                        address="0x5bcabcabcabcabcabcabcabcabcabcbcabcbcabc"
                    />
                    <Item
                        onMenuToggle={onMenuToggle}
                        address="0x6bcabcabcabcabcabcabcabcabcabcbcabcbcabc"
                    />
                </div>
            </div>
        </Modal>
    )
}

type ItemProps = HTMLAttributes<HTMLDivElement> & {
    address: string
    onMenuToggle?: (address: string, state: boolean) => void
}

function Item({ address, onMenuToggle, ...props }: ItemProps) {
    const [memberMenuOpen, setMemberMenuOpen] = useState<boolean>(false)

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(
        null
    )

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
                <Avatar account={address} />
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
                    onClick={() =>
                        void setMemberMenuOpen((current) => !current)
                    }
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
                        <MenuSeparatorItem />
                        <MenuButtonItem
                            icon={<DeleteIcon />}
                            onClick={() => {
                                setMemberMenuOpen(false)
                            }}
                        >
                            Delete member
                        </MenuButtonItem>
                    </Menu>
                )}
            </div>
        </div>
    )
}
