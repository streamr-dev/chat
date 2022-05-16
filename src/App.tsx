// import styled, { createGlobalStyle } from 'styled-components'
import tw, { styled, GlobalStyles } from 'twin.macro'
import { css, Global } from '@emotion/react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import { ToastContainer as PrestyledToastContainer } from 'react-toastify'
import RootProvider from './components/RootProvider'

const ToastContainer = styled(PrestyledToastContainer)`
    width: auto;

    .Toastify__toast-body {
        font-family: inherit;
    }

    .Toastify__toast-icon {
        margin-right: 20px;
    }
`

const customGlobalStyles = css`
    body {
        ${tw`
            antialiased
            font-karelia
        `};
    }
`

export default function App() {
    return (
        <RootProvider>
            <GlobalStyles />
            <Global styles={customGlobalStyles} />
            <div>
                {/* <SessionHandler /> */}
                {/* <Global /> */}
                <ToastContainer position="bottom-left" closeOnClick={false} />
                <HashRouter>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Chat />} path="/chat" />
                    </Routes>
                </HashRouter>
            </div>
        </RootProvider>
    )
}
