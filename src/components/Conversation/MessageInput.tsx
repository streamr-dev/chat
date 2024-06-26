import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import focus from '$/utils/focus'
import Form from '../Form'
import db from '$/utils/db'
import { DraftAction } from '$/features/drafts'
import { MessageAction } from '$/features/message'
import isBlank from '$/utils/isBlank'
import StreamrClient from '@streamr/sdk'
import SpyIcon from '$/icons/SpyIcon'
import Avatar from '$/components/Avatar'
import useAnonAccount from '$/hooks/useAnonAccount'
import useAnonClient from '$/hooks/useAnonClient'
import useAnonPrivateKey from '$/hooks/useAnonPrivateKey'
import Textarea from '$/components/Conversation/Textarea'
import i18n from '$/utils/i18n'
import { MiscAction } from '$/features/misc'

interface Props {
    disabled?: boolean
    streamrClient: StreamrClient
}

export default function MessageInput({ streamrClient, disabled = false }: Props) {
    const [value, setValue] = useState<string>('')

    const inputRef = useRef<HTMLTextAreaElement>(null)

    const submittable = !isBlank(value)

    const selectedRoomId = useSelectedRoomId()

    const dispatch = useDispatch()

    const account = useWalletAccount()

    function makeDraft(content: string) {
        if (!account || !selectedRoomId) {
            return
        }

        const now = Date.now()

        dispatch(
            DraftAction.store({
                content,
                createdAt: now,
                owner: account,
                roomId: selectedRoomId,
                updatedAt: now,
            })
        )
    }

    function send(content: string) {
        if (!selectedRoomId || !account) {
            return
        }

        dispatch(
            MessageAction.publish({
                roomId: selectedRoomId,
                content,
                streamrClient,
            })
        )
    }

    function onSubmit() {
        if (submittable) {
            send(value)
            setValue('')
            makeDraft('')
        }
    }

    useEffect(() => {
        let mounted = true

        setValue('')

        async function fn() {
            try {
                if (!account || !selectedRoomId) {
                    return
                }

                const draft = await db.drafts
                    .where({ owner: account.toLowerCase(), roomId: selectedRoomId })
                    .first()

                if (mounted && draft) {
                    setValue(draft.content)
                }
            } catch (e) {
                // Ignore.
            } finally {
                // Select a room -> focus the message input field.
                focus(inputRef.current)
            }
        }

        fn()

        return () => {
            mounted = false
        }
    }, [account, selectedRoomId])

    const anonAccount = useAnonAccount(selectedRoomId) || ''

    const anonPrivateKey = useAnonPrivateKey(selectedRoomId) || ''

    const anonClient = useAnonClient(selectedRoomId)

    const anonRoom = anonClient === streamrClient

    const seed = (anonRoom ? anonAccount : account)?.toLowerCase()

    const [isShiftDown, setIsShiftDown] = useState(false)

    const [rightOffset, setRightOffset] = useState(0)

    return (
        <>
            <Form
                css={tw`
                    bg-[#f7f9fc]
                    rounded-xl
                    w-full
                    relative
                `}
                onSubmit={onSubmit}
            >
                <Textarea
                    disabled={disabled}
                    css={tw`
                        disabled:opacity-25
                        appearance-none
                        bg-[transparent]
                        border-0
                        block
                        outline-none
                        h-full
                        py-3
                        pr-[140px]
                        pl-5
                        placeholder:text-[#59799C]
                        leading-6
                        max-h-[144px]
                        w-full
                    `}
                    autoFocus
                    onChange={(e) => {
                        setValue(e.currentTarget.value)
                        makeDraft(e.currentTarget.value)
                    }}
                    placeholder={i18n('messageInput.placeholder')}
                    onWidthOffsetChange={setRightOffset}
                    onKeyDown={(e) => {
                        setIsShiftDown(e.shiftKey)

                        if (e.key === 'Enter' && !e.shiftKey) {
                            onSubmit()

                            e.preventDefault()
                        }
                    }}
                    onKeyUp={(e) => {
                        setIsShiftDown(e.shiftKey)
                    }}
                    onBlur={() => {
                        setIsShiftDown(false)
                    }}
                    readOnly={!selectedRoomId}
                    ref={inputRef}
                    value={value}
                />
                <div
                    css={tw`
                        absolute
                        bottom-0
                        flex
                        h-12
                        items-center
                    `}
                    style={{
                        right: `${10 + rightOffset}px`,
                    }}
                >
                    {anonRoom && (
                        <button
                            type="button"
                            onClick={() =>
                                void dispatch(
                                    MiscAction.showAnonExplainerModal({
                                        anonAccount,
                                        anonPrivateKey,
                                    })
                                )
                            }
                            css={tw`
                                h-full
                                w-10
                                rounded-full
                                flex
                                items-center
                                justify-center
                                appearance-none
                                cursor-help
                            `}
                        >
                            <SpyIcon
                                css={tw`
                                    w-4
                                    h-4
                                    -translate-y-[1px]
                                    [path]:fill-[#59799C]
                                `}
                            />
                        </button>
                    )}
                    <div
                        css={tw`
                            w-10
                            grow-0
                            flex
                            items-center
                            justify-center
                        `}
                    >
                        <Avatar
                            seed={seed}
                            backgroundColor="transparent"
                            css={tw`
                                w-8
                                h-8
                            `}
                        />
                    </div>
                    <button
                        disabled={disabled}
                        type="submit"
                        css={[
                            tw`
                                appearance-none
                                bg-[transparent]
                                block
                                w-10
                                h-full
                                opacity-30
                                cursor-default
                                disabled:invisible
                                transition-opacity
                            `,
                            submittable &&
                                !isShiftDown &&
                                tw`
                                    opacity-100
                                    cursor-pointer
                                `,
                        ]}
                    >
                        <svg
                            css={tw`
                                block
                                mx-auto
                            `}
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
        </>
    )
}
