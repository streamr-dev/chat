import styled from 'styled-components'
import { Shape } from './Room'

type Props = {
    className?: string,
}

const UnstyledAddRoom = ({ className }: Props) => (
    <Shape type="button" className={className}>
        Add Room
    </Shape>
)

const AddRoom = styled(UnstyledAddRoom)``

export default AddRoom
