import styled from 'styled-components'

type Props = {
    className?: string
    onChange: (arg0: string) => void
    value: string
    accept: () => void
    reject: () => void
}

function UnstyledRoomNameEditor({
    className,
    value,
    onChange: onChangeProp,
    accept,
    reject,
}: Props) {
    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            accept()
        }

        if (e.key === 'Escape') {
            reject()
        }
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeProp(e.currentTarget.value)
    }

    return (
        <div className={className}>
            <input
                autoFocus
                className={className}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="e.g. random-giggly-bear"
                type="text"
                value={value}
            />
            <div>The room name will be publicly visible.</div>
        </div>
    )
}

const RoomNameEditor = styled(UnstyledRoomNameEditor)`
    color: #59799c;

    div {
        font-size: 0.875rem;
        margin-top: 0.5rem;
    }

    input {
        appearance: none;
        border: 0;
        font-size: 1.625rem;
        outline: 0;
        padding: 0;
        width: 100%;
    }

    input::placeholder {
        color: inherit;
    }
`

export default RoomNameEditor
