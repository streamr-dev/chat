import styled from 'styled-components'
import { ActionType, useDispatch, useStore } from '../../Store'
import RoomAction, { Collection } from './RoomAction'
import ModifyIcon from './modify.svg'
import RoomNameDisplay from './RoomNameDisplay'
import RoomNameEditor from './RoomNameEditor'
import React, { useEffect, useState } from 'react'
import RoomDropdown from '../../RoomDropdown'
import { useRenameRoom } from './RoomRenameProvider'
import useRoomName from '../../../hooks/useRoomName'

type Props = {
    className?: string
}

const RoomName = styled.div`
    flex: 1 1 auto;
    min-width: 0;
`

function UnstyledRoomHeader({ className }: Props) {
    const dispatch = useDispatch()

    const { roomNameEditable, roomId } = useStore()

    const roomName = useRoomName(roomId!)

    const [value, setValue] = useState<string>(roomName)

    useEffect(() => {
        setValue(roomName)
    }, [roomName])

    const renameRoom = useRenameRoom()

    function submit(e: React.FormEvent) {
        e.preventDefault()

        if (!roomId) {
            throw new Error('No room id')
        }

        renameRoom(roomId, value)
    }

    function reset() {
        dispatch({
            type: ActionType.EditRoomName,
            payload: false,
        })

        // We gotta manually revert the modded `value` to the original (current title).
        setValue(roomName)
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
                        <RoomAction
                            type="button"
                            onClick={reset}
                            $backgroundless
                        >
                            <span>Cancel</span>
                        </RoomAction>
                        <RoomAction type="submit">
                            <span>Save</span>
                        </RoomAction>
                    </>
                ) : roomId ? (
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
                        <RoomDropdown />
                    </>
                ) : null}
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
