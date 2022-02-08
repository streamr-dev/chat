import styled, { css } from 'styled-components'
import { KARELIA } from '../../../utils/css'

type Props = {
    $backgroundless?: boolean
}

const RoomAction = styled.button<Props>`
    appearance: none;
    background-color: #f7f9fc;
    border-radius: 1.25rem;
    border: 0;
    color: #59799c;
    cursor: pointer;
    display: block;
    font-family: ${KARELIA};
    height: 2.5rem;
    min-width: 2.5rem;
    padding: 0;
    transition: 300ms background-color;

    :hover {
        background-color: #ebeff5;
        transition-duration: 50ms;
    }

    & + & {
        margin-left: 0.75rem;
    }

    img {
        display: block;
    }

    span {
        display: block;
        padding: 0 1.5rem;
        transform: translateY(-10%);
    }

    ${({ $backgroundless = false }) =>
        $backgroundless &&
        css`
            background-color: transparent !important;
            transition: none;

            :hover {
                color: #323232;
            }
        `}
`

export const Collection = styled.div`
    display: flex;
    margin-left: 1rem;
`

export default RoomAction
