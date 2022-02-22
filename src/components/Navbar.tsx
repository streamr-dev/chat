import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Button from './Button'
import { KARELIA, SEMIBOLD } from '../utils/css'
import WalletModal from './WalletModal'
import AddressButton from './AddressButton'
import { useStore } from './Store'
import useDisconnect from '../hooks/useDisconnect'

type Props = {
    className?: string
}

const UnstyledNavbar = ({ className }: Props) => {
    const { account } = useStore()

    const disconnect = useDisconnect()

    return (
        <nav className={className}>
            <h4>
                <Link to="/">thechat.eth</Link>
            </h4>
            {account ? (
                <AddressButton
                    type="button"
                    onClick={disconnect}
                    address={account}
                />
            ) : (
                <WalletModal />
            )}
        </nav>
    )
}

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

    ${Button} {
        align-items: center;
        border-radius: 1.5rem;
        display: flex;
        font-family: ${KARELIA};
        font-weight: ${SEMIBOLD};

        :hover,
        :focus {
            background-color: #fefefe;
        }

        :active {
            background-color: #f7f7f7;
        }
    }

    ${Button} > span {
        display: block;
        transform: translateY(-0.1em);
    }
`

export default Navbar
