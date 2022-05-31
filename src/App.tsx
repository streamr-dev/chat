import tw, { styled, GlobalStyles } from 'twin.macro'
import { css, Global } from '@emotion/react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Chat from './components/pages/Chat'
import { ToastContainer as PrestyledToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store from './store'
import WalletIntegrationObserver from './components/WalletIntegrationObserver'
import Clock from './components/Clock'

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

        @keyframes rotate {
            100% {
                transform: rotate(360deg);
            }
        }
    }
`

export default function App() {
    return (
        <Provider store={store}>
            <GlobalStyles />
            <Global styles={customGlobalStyles} />
            <WalletIntegrationObserver />
            <Clock />
            <div>
                <ToastContainer position="bottom-left" closeOnClick={false} />
                <HashRouter>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Chat />} path="/chat" />
                    </Routes>
                </HashRouter>
            </div>
        </Provider>
    )
}
