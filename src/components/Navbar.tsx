import styled from 'styled-components'
import Button from './Button'
import { KARELIA } from '../utils/css'
import WalletModal from './WalletModal'

type Props = {
    className?: string
}

const UnstyledNavbar = ({ className }: Props) => (
    <nav className={className}>
        <h4>thechat.eth</h4>
        <WalletModal />
    </nav>
)

const Navbar = styled(UnstyledNavbar)`
    align-items: center;
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
`

export default Navbar
