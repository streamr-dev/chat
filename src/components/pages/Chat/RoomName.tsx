import React, { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { KARELIA, MEDIUM } from '../../../utils/css'
import { ActionType, useDispatch, useRoom, useStore } from './ChatStore'

type Props = {
    className?: string,
}

function UnstyledRoomName({ className }: Props) {
    const [value, setValue] = useState<string>('')

    const room = useRoom()

    const title = (room && room.name) || ''

    useEffect(() => {
        setValue(title)
    }, [title])

    const { roomNameEditable } = useStore()

    useEffect(() => {
        if (!roomNameEditable) {
            setValue(title)
        }
    }, [roomNameEditable, title])

    const dispatch = useDispatch()

    function reject() {
        dispatch({
            type: ActionType.EditRoomName,
            payload: false,
        })
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            dispatch({
                type: ActionType.RenameRoom,
                payload: value,
            })
        }

        if (e.key === 'Escape') {
            reject()
        }
    }

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.currentTarget.value)
    }

    function onDoubleClick() {
        dispatch({
            type: ActionType.EditRoomName,
            payload: true,
        })
    }

    return roomNameEditable ? (
        <input
            autoFocus
            className={className}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={reject}
            type="text"
            value={value}
        />
    ) : (
        <div
            className={className}
            onDoubleClick={onDoubleClick}
        >
            {title || <>Untitled room</>}
        </div>
    )
}

const RoomName = styled(UnstyledRoomName)`
    flex-grow: 1;
    font-family: ${KARELIA};
    font-size: 1.625rem;
    font-weight: ${MEDIUM};
    line-height: normal;
    padding: 0;

    input& {
        border: 0;
        outline: 0;
    }

    div& {
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        white-space: nowrap;
    }
`

export default RoomName
