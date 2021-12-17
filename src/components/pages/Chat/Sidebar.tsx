import styled from 'styled-components'
import AddRoom from './AddRoom'

type Props = {
    className?: string,
    children?: React.ReactNode,
}

const UnstyledSidebar = ({ className, children }: Props) => (
    <aside className={className}>
        <AddRoom />
        {children}
    </aside>
)

const Sidebar = styled(UnstyledSidebar)`
    height: 100%;
    overflow: auto;
    width: 22rem;
`

export default Sidebar
