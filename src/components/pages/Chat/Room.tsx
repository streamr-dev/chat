import styled, { css } from 'styled-components'

type Props = {
    active?: boolean,
    name?: string,
    recentMessage?: string | null,
    onClick?: () => void,
}

type ShapeProps = {
    $active?: boolean,
}

export const Shape = styled.button<ShapeProps>`
    align-items: center;
    appearance: none;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 1.25rem;
    border: none;
    cursor: pointer;
    display: block;
    display: flex;
    height: 5.75rem;
    padding: 0 1.5rem;
    text-align: left;
    width: 100%;
    transition: 0.8s background-color;

    & + & {
        margin-top: 1rem;
    }

    ${({ $active }) => !!$active && css`
        background-color: #ffffff !important;
        transition-duration: 0.1s;
    `}

    :hover,
    :focus {
        background-color: rgba(255, 255, 255, 0.8);
        transition-duration: 0.1s;
    }
`

const UnstyledRoom = ({ name = 'Room', recentMessage = null, active = false, onClick }: Props) => (
    <Shape $active={active} onClick={onClick}>
        <div>
            {/* Image */}
        </div>
        <div>
            <div>{name}</div>
            <div>{recentMessage == null ? 'Empty room' : recentMessage}</div>
        </div>
    </Shape>
)

const Room = styled(UnstyledRoom)``

export default Room
