import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useStore } from '../../Store'
import SubmitButton from './SubmitButton'
import focus from '../../../utils/focus'
import { useSend } from './MessageTransmitter'
import { MessageType } from '../../../utils/types'

type Props = {
    className?: string
}

type InnerProps = {
    $submittable?: boolean
}

const Inner = styled.div<InnerProps>`
    background-color: #f7f9fc;
    border-radius: 0.75rem;
    display: flex;
    height: 3rem;
    width: 100%;

    ${SubmitButton} {
        opacity: 0.3;
    }

    ${({ $submittable }) =>
        $submittable &&
        css`
            ${SubmitButton} {
                opacity: 1;
                cursor: pointer;
            }
        `}
`

function UnstyledMessageInput({ className }: Props) {
    const [value, setValue] = useState<string>('')

    const inputRef = useRef<HTMLInputElement>(null)

    const submittable = !/^\s*$/.test(value)

    const { roomId, roomNameEditable } = useStore()

    const send = useSend()

    function onSubmit() {
        send(value, { messageType: MessageType.Text })
    }

    function submit() {
        if (submittable && typeof onSubmit === 'function') {
            onSubmit()
            setValue('')
        }
    }

    function onKeyDown({ key }: React.KeyboardEvent) {
        if (key === 'Enter') {
            submit()
        }
    }

    function onSubmitClick() {
        submit()
        focus(inputRef.current)
    }

    useEffect(() => {
        focus(inputRef.current)
    }, [roomId])

    const skipRoomNameEditRef = useRef<boolean>(true)

    useEffect(() => {
        if (skipRoomNameEditRef.current) {
            skipRoomNameEditRef.current = false
            return
        }

        if (!roomNameEditable) {
            focus(inputRef.current)
        }
    }, [roomNameEditable])

    return (
        <div className={className}>
            <Inner $submittable={submittable}>
                <input
                    autoFocus
                    onChange={(e) => {
                        setValue(e.currentTarget.value)
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Type a message"
                    readOnly={!roomId}
                    ref={inputRef}
                    type="text"
                    value={value}
                />
                <SubmitButton onClick={onSubmitClick} />
            </Inner>
        </div>
    )
}

const MessageInput = styled(UnstyledMessageInput)`
    padding: 1.5rem;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    input {
        appearance: none;
        background: transparent;
        border: 0;
        flex-grow: 1;
        outline: 0;
        height: 100%;
        padding: 0 0 0 1.25rem;
    }
`

export default MessageInput
