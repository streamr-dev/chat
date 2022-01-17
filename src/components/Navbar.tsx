import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Button from './Button'
import { KARELIA } from '../utils/css'
import { initializeMetamaskDelegatedAccess } from '../lib/MetamaskDelegatedAccess'

import { ActionType, useDispatch, useMessages, useStore } from './Store'

type Props = {
    className?: string
}

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
                <Button type="button" onClick={disconnect}>
                    {store.metamaskAddress}
                </Button>
            ) : (
                <Button type="button" onClick={connect}>
                    Connect a wallet
                </Button>
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
        border-radius: 100px;
        color: #ff5924;
        font-family: ${KARELIA};
        font-size: 15px;
        height: 100%;
        padding: 10px 30px 13px;
    }

    ${Button}:hover,
    ${Button}:focus {
        background-color: #fefefe;
    }

    ${Button}:active {
        background-color: #f7f7f7;
    }
`

export default Navbar
