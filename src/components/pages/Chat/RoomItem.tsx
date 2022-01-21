import styled from 'styled-components'
import type { Props as SidebarItemProps } from './SidebarItem'
import SidebarItem from './SidebarItem'
import type { MessagePayload } from '../../../utils/types'
import { ActionType, useDispatch, useStore } from '../../Store'

type Props = SidebarItemProps & {
    id: string
    name?: string
    recentMessage?: MessagePayload
    unread?: boolean
}

const Name = styled.div``

const RecentMessage = styled.div`
    color: #59799c;
    font-size: 0.875rem;
`

function UnstyledRoomItem({ id, name = id, icon = <div />, ...props }: Props) {
    const { roomId, recentMessages } = useStore()

    const dispatch = useDispatch()

    const active = id === roomId

    const recentMessage = recentMessages[id]

    function onClick() {
        dispatch({
            type: ActionType.SelectRoom,
            payload: id,
        })
    }

    return (
        <SidebarItem
            {...props}
            afterContent={<></>}
            active={active}
            icon={icon}
            onClick={onClick}
        >
            <Name>{name || <>Untitled room</>}</Name>
            <RecentMessage>
                {recentMessage || 'Empty room'}
            </RecentMessage>
        </SidebarItem>
    )
}

const RoomItem = styled(UnstyledRoomItem)`
    ${Name},
    ${RecentMessage} {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`

export default RoomItem
