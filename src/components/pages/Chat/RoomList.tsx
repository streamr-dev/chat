import styled from 'styled-components'
import AddRoom from './AddRoomItem'

type Props = {
    className?: string,
    children?: React.ReactNode,
}

const UnstyledRoomList = ({ className, children }: Props) => (
    <aside className={className}>
        <AddRoom />
        {children}
    </aside>
)

const RoomList = styled(UnstyledRoomList)`
    height: 100%;
    overflow: auto;
    width: 22rem;
`

export default RoomList
