import styled from 'styled-components'
import { ActionType, useDispatch, useRoom, useStore } from '../../Store'
import RoomAction, { Collection } from './RoomAction'
import ModifyIcon from './modify.svg'
import MoreIcon from './more.svg'
import RoomNameDisplay from './RoomNameDisplay'
import RoomNameEditor from './RoomNameEditor'
import React, { useEffect, useState } from 'react'

type Props = {
    className?: string
}

const RoomName = styled.div`
    flex: 1 1 auto;
    min-width: 0;
`

function UnstyledRoomHeader({ className }: Props) {
    const dispatch = useDispatch()

    const { roomNameEditable } = useStore()

    const room = useRoom()

    const title = (room && room.name) || ''

    const [value, setValue] = useState<string>(title)

    useEffect(() => {
        setValue(title)
    }, [title])

    function submit(e: React.FormEvent) {
        e.preventDefault()

        dispatch({
            type: ActionType.RenameRoom,
            payload: value,
        })
    }

    function reset() {
        dispatch({
            type: ActionType.EditRoomName,
            payload: false,
        })

        // We gotta manually revert the modded `value` to the original (current title).
        setValue(title)
    }

    return (
        <form className={className} onSubmit={submit}>
            <RoomName>
                {roomNameEditable ? (
                    <RoomNameEditor
                        onAbort={reset}
                        onChange={setValue}
                        value={value}
                    />
                ) : (
                    <RoomNameDisplay />
                )}
            </RoomName>
            <Collection>
                {roomNameEditable ? (
                    <>
                        <RoomAction type="button" onClick={reset} $backgroundless>
                            <span>Cancel</span>
                        </RoomAction>
                        <RoomAction type="submit">
                            <span>Save</span>
                        </RoomAction>
                    </>
                ) : (
                    <>
                        <RoomAction
                            type="button"
                            onClick={() => {
                                dispatch({
                                    type: ActionType.EditRoomName,
                                    payload: true,
                                })
                            }}
                        >
                            <img src={ModifyIcon} alt="" />
                        </RoomAction>
                        <RoomAction type="button">
                            <img src={MoreIcon} alt="" />
                        </RoomAction>
                    </>
                )}
            </Collection>
        </form>
    )
}

const RoomHeader = styled(UnstyledRoomHeader)`
    align-items: center;
    box-shadow: inset 0 -1px 0 #dee6ee;
    display: flex;
    height: 92px;
    padding: 0 2rem;
    position: absolute;
    top: 0;
    width: 100%;
`

export default RoomHeader
