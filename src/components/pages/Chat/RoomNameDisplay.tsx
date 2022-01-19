import styled from 'styled-components'
import { KARELIA, MEDIUM } from '../../../utils/css'
import { ActionType, useDispatch, useRoom } from '../../Store'

type Props = {
    className?: string
}

function UnstyledRoomNameDisplay({ className }: Props) {
    const room = useRoom()

    const title = (room && room.name) || 'Untitled room'

    const dispatch = useDispatch()

    function onDoubleClick() {
        dispatch({
            type: ActionType.EditRoomName,
            payload: true,
        })
    }

    return (
        <div onDoubleClick={onDoubleClick} className={className}>
            {title}
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
