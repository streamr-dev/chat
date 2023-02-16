import tw, { GlobalStyles } from 'twin.macro'
import { css, Global } from '@emotion/react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '$/store'
import Clock from '$/components/Clock'
import IndexPage from '$/components/IndexPage'
import Toaster from '$/components/Toaster'

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

        @keyframes bringIn {
            from {
                opacity: 0;
                transform: translateZ(0) scale(0.98);
            }
            to {
                opacity: 1;
                transform: translateZ(0) scale(1);
            }
        }

        @keyframes toastIn {
            from {
                transform: translateX(100%) translateZ(0);
            }
            to {
                transform: translateX(0) translateZ(0);
            }
        }

        @keyframes toastOut {
            from {
                transform: translateX(0) translateZ(0);
            }
            to {
                transform: translateX(100%) translateZ(0);
            }
        }

        @keyframes toastSqueeze {
            from {
                transform: translateX(100%) translateZ(0);
            }
            to {
                height: 0;
                margin-top: 0;
                margin-right: 0;
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
                <HashRouter>
                    <IndexPage />
                </HashRouter>
            </div>
            <Toaster />
        </Provider>
    )
}
