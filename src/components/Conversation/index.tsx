import { ButtonHTMLAttributes, useLayoutEffect, useRef, useState } from 'react'
import tw, { css } from 'twin.macro'
import AddMemberIcon from '../../icons/AddMemberIcon'
import CopyIcon from '../../icons/CopyIcon'
import DeleteIcon from '../../icons/DeleteIcon'
import EditMembersIcon from '../../icons/EditMembersIcon'
import AddMemberModal from '../AddMemberModal'
import EditMembersModal from '../EditMembersModal'
import Form from '../Form'
import Menu, { MenuButtonItem, MenuContainer, MenuSeparatorItem } from '../Menu'
import SecondaryButton from '../SecondaryButton'
import Text from '../Text'
import Message from './Message'
import MessageInput from './MessageInput'

export default function Conversation() {
    const roomName = ''

    const [isRoomNameEditable, setIsRoomNameEditable] = useState<boolean>(false)

    const [newRoomName, setNewRoomName] = useState<string>(roomName)

    function abortNameEdit() {
        setIsRoomNameEditable(false)
        setNewRoomName(roomName)
    }

    function onNameDoubleClick() {
        setIsRoomNameEditable(true)
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Escape') {
            abortNameEdit()
        }
    }

    function onInternalNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewRoomName(e.target.value)
    }

    const [roomMenuOpen, setRoomMenuOpen] = useState<boolean>(false)

    const { current: messages } = useRef<string[]>(
        'lorem ipsum dolor sit emat'.split(/\s/)
    )

    const [addMemberModalOpen, setAddMemberModalOpen] = useState<boolean>(false)

    const [editMembersModalOpen, setEditMembersModalOpen] =
        useState<boolean>(false)

    return (
        <>
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
                                onChange={onInternalNameChange}
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
                            <Text tw="truncate">
                                {roomName || 'Unnamed room'}&zwnj;
                            </Text>
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
                        <ActionButton
                            onClick={() => void setIsRoomNameEditable(true)}
                        >
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
                        <MenuContainer
                            tw="ml-3"
                            onMouseDownOutside={() =>
                                void setRoomMenuOpen(false)
                            }
                        >
                            <ActionButton
                                active={roomMenuOpen}
                                onClick={() =>
                                    void setRoomMenuOpen((current) => !current)
                                }
                            >
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20 22C21.1046 22 22 21.1046 22 20C22 18.8954 21.1046 18 20 18C18.8954 18 18 18.8954 18 20C18 21.1046 18.8954 22 20 22Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M14 22C15.1046 22 16 21.1046 16 20C16 18.8954 15.1046 18 14 18C12.8954 18 12 18.8954 12 20C12 21.1046 12.8954 22 14 22Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M26 22C27.1046 22 28 21.1046 28 20C28 18.8954 27.1046 18 26 18C24.8954 18 24 18.8954 24 20C24 21.1046 24.8954 22 26 22Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </ActionButton>
                            {roomMenuOpen && (
                                <Menu>
                                    <MenuButtonItem
                                        icon={<AddMemberIcon />}
                                        onClick={() => {
                                            setAddMemberModalOpen(true)
                                            setRoomMenuOpen(false)
                                        }}
                                    >
                                        Add member
                                    </MenuButtonItem>
                                    <MenuButtonItem
                                        icon={<EditMembersIcon />}
                                        onClick={() => {
                                            setEditMembersModalOpen(true)
                                            setRoomMenuOpen(false)
                                        }}
                                    >
                                        Edit members
                                    </MenuButtonItem>
                                    <MenuSeparatorItem />
                                    <MenuButtonItem icon={<CopyIcon />}>
                                        Copy room id
                                    </MenuButtonItem>
                                    <MenuSeparatorItem />
                                    <MenuButtonItem icon={<DeleteIcon />}>
                                        Delete room
                                    </MenuButtonItem>
                                </Menu>
                            )}
                        </MenuContainer>
                    </div>
                )}
            </Form>
            <div
                css={[
                    tw`
                        h-full
                        pt-[92px]
                        pb-[92px]
                    `,
                ]}
            >
                <div
                    css={[
                        tw`
                            h-full
                        `,
                    ]}
                >
                    <div
                        css={[
                            tw`
                                h-full
                                flex
                                flex-col
                            `,
                        ]}
                    >
                        <div tw="flex-grow" />
                        <MessageFeed messages={messages} />
                    </div>
                </div>
            </div>
            <MessageInput />
            <>
                <AddMemberModal
                    open={addMemberModalOpen}
                    setOpen={setAddMemberModalOpen}
                />
                <EditMembersModal
                    open={editMembersModalOpen}
                    setOpen={setEditMembersModalOpen}
                />
            </>
        </>
    )
}

type ActionTextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    secondary?: boolean
}

function ActionTextButton({
    secondary = false,
    ...props
}: ActionTextButtonProps) {
    return (
        <SecondaryButton
            {...props}
            css={[
                tw`
                    block
                    font-medium
                    h-10
                    px-5
                    text-[0.875rem]
                `,
                secondary &&
                    tw`
                        bg-[transparent]
                    `,
            ]}
        />
    )
}

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
}

function ActionButton({ active = false, ...props }: ActionButtonProps) {
    return (
        <SecondaryButton
            {...props}
            css={[
                tw`
                    bg-[#F7F9FC]
                    block
                    p-0
                    w-10
                    h-10
                    hover:bg-[#E0E7F2]
                `,
                active &&
                    tw`
                        bg-[#E0E7F2]
                    `,
            ]}
        />
    )
}

type MessageFeedProps = {
    messages: string[]
}

function MessageFeed({ messages }: MessageFeedProps) {
    const rootRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const { current: root } = rootRef

        if (root) {
            // Auto-scroll to the most recent message.
            root.scrollTop = root.scrollHeight
        }
    }, [messages])

    return (
        <div
            ref={rootRef}
            css={[
                tw`
                    max-h-full
                    overflow-auto
                    px-6
                    pt-6
                    [> *]:mt-[0.625rem]
                `,
            ]}
        >
            {messages.map((message, index) => (
                <Message
                    key={index}
                    sender={getSender(message)}
                    incoming={message === 'lorem'}
                    createdAt={Date.now()}
                >
                    {message}
                </Message>
            ))}
        </div>
    )
}

function getSender(message: string) {
    return message === 'lorem' ? '0xasdas' : '0xefsdf'
}
