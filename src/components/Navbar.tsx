import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Button from './Button'
import { KARELIA } from '../utils/css'
import { initializeMetamaskDelegatedAccess } from '../lib/MetamaskDelegatedAccess'

import { useState } from 'react';


type Props = {
    className?: string
}

const UnstyledNavbar = ({ className }: Props) => {    
    const [metamaskAddress, setAddress] = useState('0x')
    const [connected, setConnected] = useState<boolean>(false)
    const connect = async () => {
        const access = await initializeMetamaskDelegatedAccess()
        console.log(`connected with Metamask address: ${access.metamaskAddress}`)  
        console.log(`connected with session address: ${access.sessionAddress}`)
        setAddress(access.metamaskAddress as string)
        setConnected(true)
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
            { connected ? 
                <Button type="button" onClick={disconnect}>{metamaskAddress}</Button>
                :
                <Button type="button" onClick={connect}>Connect a wallet</Button>
            }
        </nav>
    );
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
