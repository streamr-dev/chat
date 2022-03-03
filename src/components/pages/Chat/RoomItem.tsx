import styled from 'styled-components'
import type { Props as SidebarItemProps } from './SidebarItem'
import SidebarItem from './SidebarItem'
import type { MessagePayload } from '../../../utils/types'
import { ActionType, useDispatch, useStore } from '../../Store'
import Identicon from 'identicon.js'
import useRoomName from '../../../hooks/useRoomName'
import { keccak256 } from 'js-sha3'

type Props = SidebarItemProps & {
    id: string
    recentMessage?: MessagePayload
    unread?: boolean
}

const Name = styled.div``

const RecentMessage = styled.div`
    color: #59799c;
    font-size: 0.875rem;
`

const AvatarWrap = styled.div`
    padding: 0.5rem;
`

const Avatar = styled.img`
    background-color: #f1f4f7;
    display: block;
    height: 2rem;
    width: 2rem;
`

const AVATAR_OPTIONS: any = {
    size: 32,
    background: [255, 255, 255, 255],
}

function UnstyledRoomItem({ id, ...props }: Props) {
    const { roomId, recentMessages } = useStore()

    const name = useRoomName(id)

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
            icon={
                <AvatarWrap>
                    <Avatar
                        src={`data:image/png;base64,${new Identicon(
                            keccak256(id),
                            AVATAR_OPTIONS
                        ).toString()}`}
                        alt={id}
                    />
                </AvatarWrap>
            }
            onClick={onClick}
        >
            <Name>{name || <>Untitled room</>}</Name>
            <RecentMessage>{recentMessage || 'Empty room'}</RecentMessage>
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
