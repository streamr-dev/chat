import { HTMLAttributes, useState } from 'react'
import tw from 'twin.macro'
import CopyIcon from '../icons/CopyIcon'
import DeleteIcon from '../icons/DeleteIcon'
import ExternalLinkIcon from '../icons/ExternalLinkIcon'
import MoreIcon from '../icons/MoreIcon'
import trunc from '../utils/trunc'
import ActionButton from './ActionButton'
import Avatar from './Avatar'
import Menu, { MenuButtonItem, MenuContainer, MenuSeparatorItem } from './Menu'
import Modal, { ModalProps } from './Modal'

export default function EditMembersModal(props: ModalProps) {
    return (
        <Modal {...props} title="Edit members">
            <div
                css={[
                    tw`
                        h-[320px]
                        overflow-auto
                        [> * + *]:mt-4
                    `,
                ]}
            >
                <Item address="0xabcabcabcabcabcabcabcabcabcabcbcabcbcabc" />
                <Item address="0xabcabcabcabcabcabcabcabcabcabcbcabcbcabc" />
                <Item address="0xabcabcabcabcabcabcabcabcabcabcbcabcbcabc" />
                <Item address="0xabcabcabcabcabcabcabcabcabcabcbcabcbcabc" />
                <Item address="0xabcabcabcabcabcabcabcabcabcabcbcabcbcabc" />
                <Item address="0xabcabcabcabcabcabcabcabcabcabcbcabcbcabc" />
            </div>
        </Modal>
    )
}

type ItemProps = HTMLAttributes<HTMLDivElement> & {
    address: string
}

function Item({ address, ...props }: ItemProps) {
    const [memberMenuOpen, setMemberMenuOpen] = useState<boolean>(false)

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(
        null
    )

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
                <MenuContainer
                    onMouseDownOutside={() => void setMemberMenuOpen(false)}
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
                        <Menu anchorEl={menuAnchorEl}>
                            <MenuButtonItem icon={<ExternalLinkIcon />}>
                                View on explorer
                            </MenuButtonItem>
                            <MenuButtonItem icon={<CopyIcon />}>
                                Copy address
                            </MenuButtonItem>
                            <MenuSeparatorItem />
                            <MenuButtonItem icon={<DeleteIcon />}>
                                Delete member
                            </MenuButtonItem>
                        </Menu>
                    )}
                </MenuContainer>
            </div>
        </div>
    )
}
