import styled from 'styled-components'
import Button from './Button'
import { KARELIA } from '../utils/css'
// import { BreakTest } from '../lib/BreakTest'
import { initializeMetamaskDelegatedAccess } from '../lib/MetamaskDelegatedAccess'

import React, { useState } from 'react';


type Props = {
    className?: string
}

const UnstyledNavbar = ({ className }: Props) => {
    const [buttonText, setActive] = useState('Connect a wallet');
    return (
        <nav className={className}>
            <h4>thechat.eth</h4>
            <Button
                type="button"
                onClick={async () => {
                    if (buttonText === 'Connect a wallet') {
                        const access = await initializeMetamaskDelegatedAccess()
                        console.log(`connected with Metamask address: ${access.metamaskAddress}`)  
                        console.log(`connected with session address: ${access.sessionAddress}`)
                        setActive(access.metamaskAddress as string)
                    } else {
                        localStorage.clear()
                        window.location.reload()
                    }
                }}
            >
                {buttonText}
            </Button>
        </nav>
    );
}
/*
const UnstyledNavbar = ({ className }: Props) => (
    <nav className={className}>
        <h4>thechat.eth</h4>
        <Button
            type="button"
            onClick={async () => {
                //const test = await BreakTest()
                const access = await initializeMetamaskDelegatedAccess()
                console.log('access', access)
                //buttonText = access.metamaskAddress as string
                buttonText = access.metamaskAddress as string
            }}
        >
            {{buttonText}}
        </Button>
    </nav>
)
*/
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
