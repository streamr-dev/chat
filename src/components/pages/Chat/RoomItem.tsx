import styled from 'styled-components'
import type { Props as SidebarItemProps } from './SidebarItem'
import SidebarItem from './SidebarItem'
import type { MessagePayload } from './types'
import { ActionType, useDispatch, useStore } from './ChatStore'

type Props = SidebarItemProps & {
    id: string,
    name?: string,
    recentMessage?: MessagePayload,
    unread?: boolean,
}

const Name = styled.div``

const RecentMessage = styled.div`
    color: #59799C;
    font-size: 0.875rem;
`

function UnstyledRoomItem({ id, name = 'Room', icon = <div />, ...props }: Props) {
    const { roomId, messages } = useStore()

    const dispatch = useDispatch()

    const recentMessage: MessagePayload | undefined = [...messages[id]].pop()

    const active = id === roomId

    function onClick() {
        dispatch({
            type: ActionType.SelectRoom,
            payload: id,
        })
    }

    return (
        <SidebarItem
            {...props}
            afterContent={(
                <></>
            )}
            active={active}
            icon={icon}
            onClick={onClick}
        >
            <Name>{name || <>Untitled room</>}</Name>
            <RecentMessage>{(recentMessage && recentMessage.body) || 'Empty room'}</RecentMessage>
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
