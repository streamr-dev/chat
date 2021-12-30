import { useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import SubmitButton from './SubmitButton'

type Props = {
    className?: string,
    onSubmit?: (arg0: string) => void,
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

function UnstyledMessageInput({ className, onSubmit }: Props) {
    const [value, setValue] = useState<string>('')

    const inputRef = useRef<HTMLInputElement>(null)

    const submittable = !/^\s*$/.test(value)

    function submit() {
        if (submittable && typeof onSubmit === 'function') {
            onSubmit(value)
            setValue('')
        }
    }

    const onKeyDown = ({ key }: React.KeyboardEvent) => {
        if (key === 'Enter') {
            submit()
        }
    }

    const onSubmitClick = () => {
        const { current: input } = inputRef

        submit()

        if (input) {
            input.focus()
        }
    }

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
