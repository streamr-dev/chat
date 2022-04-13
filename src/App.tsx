import styled, { createGlobalStyle } from 'styled-components'
import { PLEX } from './utils/css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Chat from './components/pages/Chat'
import Store from './components/Store'
import EthereumProviderDetector from './components/EthereumProviderDetector'
import SessionHandler from './components/SessionHandler'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

const StyledToastContainer = styled(ToastContainer)`
    width: auto;

    .Toastify__toast-body {
        font-family: ${PLEX};
    }

    .Toastify__toast-icon {
        margin-right: 20px;
    }
`

const Global = createGlobalStyle`
    html,
    body {
        font-family: ${PLEX};
        font-size: 16px;
        padding: 0;
        margin: 0;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    * {
        box-sizing: border-box;
    }

    input,
    textarea {
        font-family: inherit;
    }
`

export default function App() {
    return (
        <Store>
            <EthereumProviderDetector />
            <SessionHandler />
            <Global />
            <StyledToastContainer position="bottom-left" closeOnClick={false} />
            <HashRouter>
                <Routes>
                    <Route element={<Home />} path="/" />
                    <Route element={<Chat />} path="/chat" />
                </Routes>
            </HashRouter>
        </Store>
    )
}
