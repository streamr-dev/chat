import styled from 'styled-components'
import { ActionType, useDispatch, useRoom, useStore } from './ChatStore'
import RoomAction, { Collection } from './RoomAction'
import ModifyIcon from './modify.svg'
import MoreIcon from './more.svg'
import RoomNameDisplay from './RoomNameDisplay'
import RoomNameEditor from './RoomNameEditor'
import { useEffect, useState } from 'react'

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

    function accept() {
        dispatch({
            type: ActionType.RenameRoom,
            payload: value,
        })
    }

    function reject() {
        dispatch({
            type: ActionType.EditRoomName,
            payload: false,
        })

        // We gotta manually revert the modded `value` to the original (current title).
        setValue(title)
    }

    return (
        <div className={className}>
            <RoomName>
                {roomNameEditable ? (
                    <RoomNameEditor
                        accept={accept}
                        onChange={setValue}
                        reject={reject}
                        value={value}
                    />
                ) : (
                    <RoomNameDisplay />
                )}
            </RoomName>
            <Collection>
                {roomNameEditable ? (
                    <>
                        <RoomAction $backgroundless onClick={reject}>
                            <span>Cancel</span>
                        </RoomAction>
                        <RoomAction onClick={accept}>
                            <span>Save</span>
                        </RoomAction>
                    </>
                ) : (
                    <>
                        <RoomAction
                            onClick={() => {
                                dispatch({
                                    type: ActionType.EditRoomName,
                                    payload: true,
                                })
                            }}
                        >
                            <img src={ModifyIcon} alt="" />
                        </RoomAction>
                        <RoomAction>
                            <img src={MoreIcon} alt="" />
                        </RoomAction>
                    </>
                )}
            </Collection>
        </div>
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
