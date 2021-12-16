import styled from 'styled-components'
import { KARELIA } from '../utils/css'

type Props = {
    className?: string
}

const UnstyledNavbar = ({ className }: Props) => (
    <nav className={className}>
        <h4>Streamr.Chat</h4>
        <button
            type="button"
            onClick={() => {
                console.log('Connect!')
            }}
        >
            Connect a wallet
        </button>
    </nav>
)

const Navbar = styled(UnstyledNavbar)`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 24px;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 24px;
    position: absolute;
    top: 0px;
    width: 100%;

    h4 {
        flex-grow: 1;
        font-size: 22px;
        margin: 0px;
    }

    button {
        background: white;
        border-radius: 100px;
        border: none;
        color: #ff5924;
        font-family: ${KARELIA};
        font-size: 15px;
        height: 100%;
        padding: 10px 30px 13px;
        transition: all 0.3s ease-in-out;
    }

    button:hover,
    button:focus {
        background-color: #f7f7f7;
        transform: translateY(5px);
    }
`

export default Navbar
