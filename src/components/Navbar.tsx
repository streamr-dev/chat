import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Button from './Button'
import { KARELIA, SEMIBOLD } from '../utils/css'
import { initializeMetamaskDelegatedAccess } from '../lib/MetamaskDelegatedAccess'
import AddressButton from './AddressButton'
import { ActionType, useDispatch, useStore } from './Store'

type Props = {
    className?: string
}

const ConnectButton = styled(Button)`
    color: #ff5924;
    font-size: 15px;
    padding: 0 30px;
`

const UnstyledNavbar = ({ className }: Props) => {
    const dispatch = useDispatch()
    const store = useStore()
    const connect = async () => {
        const access = await initializeMetamaskDelegatedAccess()
        console.info(
            `connected with Metamask address: ${access.metamask.address}`
        )
        console.info(
            `connected with session address: ${access.session.address}`
        )

        dispatch({
            type: ActionType.SetSession,
            payload: access,
        })
    }

    const disconnect = () => {
        localStorage.clear()
        window.location.reload()
    }
    return (
        <nav className={className}>
            <h4>
                <Link to="/">thechat.eth</Link>
            </h4>
            {store.metamaskAddress ? (
                <AddressButton
                    type="button"
                    onClick={disconnect}
                    address={store.metamaskAddress}
                />
            ) : (
                <ConnectButton type="button" onClick={connect}>
                    <span>Connect a wallet</span>
                </ConnectButton>
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
