import styled from 'styled-components'
import AddRoom from './AddRoomModal/AddRoomItem'

type Props = {
    className?: string
    children?: React.ReactNode
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

    @media only screen and (max-width: 768px) {
        height: 50%;
        width: 100%;
    }
`

export default RoomList
