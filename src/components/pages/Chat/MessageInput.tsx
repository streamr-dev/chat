import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { ActionType, useDispatch, useDraft, useStore } from './ChatStore'
import SubmitButton from './SubmitButton'

type Props = {
    className?: string,
}

type InnerProps = {
    $submittable?: boolean,
}

const Inner = styled.div<InnerProps>`
    background-color: #F7F9FC;
    border-radius: 0.75rem;
    display: flex;
    height: 3rem;
    width: 100%;

    ${SubmitButton} {
        opacity: 0.3;
    }

    ${({ $submittable }) => $submittable && css`
        ${SubmitButton} {
            opacity: 1;
        }
    `}
`

function focus(input: HTMLInputElement | null): void {
    if (input) {
        input.focus()
        input.setSelectionRange(input.value.length, input.value.length)
    }
}

function UnstyledMessageInput({ className }: Props) {
    const draft = useDraft()

    const inputRef = useRef<HTMLInputElement>(null)

    const submittable = !/^\s*$/.test(draft)

    const dispatch = useDispatch()

    const { identity, roomId } = useStore()

    function onSubmit(body: string) {
        if (identity == null) {
            return
        }

        dispatch({
            type: ActionType.AddMessages,
            payload: [{
                body,
                createdAt: Date.now(),
                sender: identity,
                id: uuidv4(),
            }],
        })
    }

    function submit() {
        if (submittable && typeof onSubmit === 'function') {
            onSubmit(draft)
            dispatch({
                type: ActionType.SetDraft,
                payload: '',
            })
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

    return (
        <div className={className}>
            <Inner $submittable={submittable}>
                <input
                    autoFocus
                    onChange={(e) => {
                        dispatch({
                            type: ActionType.SetDraft,
                            payload: e.currentTarget.value,
                        })
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Type a message"
                    ref={inputRef}
                    type="text"
                    value={draft}
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
