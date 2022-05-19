import tw, { styled, GlobalStyles } from 'twin.macro'
import { css, Global } from '@emotion/react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import { ToastContainer as PrestyledToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store from './store'
import AccountWatcher from './components/AccountWatcher'
import WalletObserver from './components/WalletObserver'

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
        <Provider store={store}>
            <GlobalStyles />
            <Global styles={customGlobalStyles} />
            <WalletObserver />
            <AccountWatcher />
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
