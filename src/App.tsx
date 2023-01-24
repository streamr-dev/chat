import tw, { styled, GlobalStyles } from 'twin.macro'
import { css, Global } from '@emotion/react'
import { HashRouter } from 'react-router-dom'
import { ToastContainer as PrestyledToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store from '$/store'
import Clock from '$/components/Clock'
import IndexPage from '$/components/IndexPage'

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

        @keyframes loadingIndicator {
            0% {
                transform: translateX(-100%) translateZ(0);
            }

            45% {
                transform: translateX(0%) translateZ(0);
            }

            55% {
                transform: translateX(0%) translateZ(0);
            }

            100% {
                transform: translateX(100%) translateZ(0);
            }
        }
    }
`

export default function App() {
    return (
        <Provider store={store}>
            <GlobalStyles />
            <Global styles={customGlobalStyles} />
            <Clock />
            <div>
                <ToastContainer position="bottom-left" closeOnClick={false} />
                <HashRouter>
                    <IndexPage />
                </HashRouter>
            </div>
        </Provider>
    )
}
