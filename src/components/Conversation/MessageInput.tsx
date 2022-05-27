import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { createMessage } from '../../features/messages/actions'
import { useSelectedRoomId } from '../../features/rooms/hooks'
import { useWalletAccount } from '../../features/wallet/hooks'
import focus from '../../utils/focus'
import Form from '../Form'
import { v4 as uuidv4 } from 'uuid'

enum MessageType {
    Text = 'text',
}

export default function MessageInput() {
    const [value, setValue] = useState<string>('')

    const inputRef = useRef<HTMLInputElement>(null)

    const submittable = !/^\s*$/.test(value)

    const selectedRoomId = useSelectedRoomId()

    const dispatch = useDispatch()

    const account = useWalletAccount()

    function send(content: string) {
        if (!selectedRoomId) {
            return
        }

        if (!account) {
            return
        }

        const now = Date.now()

        const createdBy = account.toLowerCase()

        dispatch(
            createMessage({
                content,
                createdAt: now,
                updatedAt: now,
                createdBy,
                id: uuidv4(),
                owner: createdBy,
                roomId: selectedRoomId,
            })
        )
    }

    function onSubmit() {
        if (submittable) {
            send(value)
            setValue('')
        }
    }

    useEffect(() => {
        // Select a room -> focus the message input field.
        focus(inputRef.current)
    }, [selectedRoomId])

    return (
        <Form
            css={[
                tw`
                    absolute
                    p-6
                    bottom-0
                    left-0
                    w-full
                `,
            ]}
            onSubmit={onSubmit}
        >
            <div
                css={[
                    tw`
                        bg-[#f7f9fc]
                        rounded-xl
                        flex
                        h-12
                        w-full
                    `,
                ]}
            >
                <input
                    css={[
                        tw`
                            appearance-none
                            bg-[transparent]
                            border-0
                            flex-grow
                            outline-none
                            h-full
                            p-0
                            pl-5
                            placeholder:text-[#59799C]
                        `,
                    ]}
                    autoFocus
                    onChange={(e) => {
                        setValue(e.currentTarget.value)
                    }}
                    placeholder="Type a message"
                    readOnly={!selectedRoomId}
                    ref={inputRef}
                    type="text"
                    value={value}
                />
                <button
                    type="submit"
                    css={[
                        tw`
                            bg-[transparent]
                            block
                            w-[60px]
                            opacity-30
                            cursor-default
                        `,
                        submittable &&
                            tw`
                                opacity-100
                                cursor-pointer
                            `,
                    ]}
                >
                    <svg
                        css={[
                            tw`
                                block
                                mx-auto
                            `,
                        ]}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19.9827 1.43323L17.4827 17.6442C17.4437 18.0348 17.2093 18.3864 16.8577 18.5817C16.6624 18.6598 16.4671 18.7379 16.2327 18.7379C16.0765 18.7379 15.9202 18.6989 15.764 18.6207L10.9984 16.6285L9.00617 19.5973C8.84992 19.8707 8.57648 19.9879 8.30304 19.9879C7.87335 19.9879 7.52179 19.6364 7.52179 19.2067V15.4567C7.52179 15.1442 7.59992 14.8707 7.75617 14.6754L16.2718 3.73792L4.78742 14.0895L0.76398 12.4098C0.334292 12.2145 0.0217923 11.8239 0.0217923 11.316C-0.0172702 10.7692 0.217105 10.3785 0.646792 10.1442L18.1468 0.183235C18.5374 -0.0511401 19.0843 -0.0511401 19.4749 0.222297C19.8655 0.495735 20.0609 0.964485 19.9827 1.43323Z"
                            fill="#FF5924"
                        />
                    </svg>
                </button>
            </div>
        </Form>
    )
}
