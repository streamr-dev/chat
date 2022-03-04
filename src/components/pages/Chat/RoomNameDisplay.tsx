import styled from 'styled-components'
import useRoomName from '../../../hooks/useRoomName'
import { KARELIA, MEDIUM } from '../../../utils/css'
import { ActionType, useDispatch, useStore } from '../../Store'

type Props = {
    className?: string
}

function UnstyledRoomNameDisplay({ className }: Props) {
    const dispatch = useDispatch()
    const { roomId } = useStore()

    const roomName = useRoomName(roomId!)

    function onDoubleClick() {
        dispatch({
            type: ActionType.EditRoomName,
            payload: true,
        })
    }

    return (
        <div onDoubleClick={onDoubleClick} className={className}>
            {roomName}&zwnj;
        </div>
    )
}

const RoomNameDisplay = styled(UnstyledRoomNameDisplay)`
    font-family: ${KARELIA};
    font-size: 1.625rem;
    font-weight: ${MEDIUM};
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
    white-space: nowrap;
`

export default RoomNameDisplay
