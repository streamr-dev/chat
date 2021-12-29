import styled from 'styled-components'
import type { Props as SidebarItemProps } from './SidebarItem'
import SidebarItem from './SidebarItem'
import type { MessagePayload } from './Message'

type Props = SidebarItemProps & {
    name?: string,
    recentMessage?: MessagePayload,
    unread?: boolean,
}

const Name = styled.div``

const RecentMessage = styled.div`
    color: #59799C;
    font-size: 0.875rem;
`

const UnstyledRoom = ({ name = 'Room', recentMessage, icon = <div />, ...props }: Props) => (
    <SidebarItem
        {...props}
        icon={icon}
        afterContent={(
            <>1</>
        )}
    >
        <Name>{name}</Name>
        <RecentMessage>{(recentMessage && recentMessage.body) || 'Empty room'}</RecentMessage>
    </SidebarItem>
)

const Room = styled(UnstyledRoom)`
    ${Name},
    ${RecentMessage} {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`

export default Room
