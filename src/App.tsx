import { createGlobalStyle } from 'styled-components'
import { PLEX } from './utils/css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Chat from './Chat'

const Global = createGlobalStyle`
    html,
    body {
        font-family: ${PLEX};
    }
`

export default function App() {
    return (
        <>
            <Global />
            <HashRouter>
                <Routes>
                    <Route
                        element={<Home />}
                        path="/"
                    />
                    <Route
                        element={<Chat />}
                        path="/chat"
                    />
                </Routes>
            </HashRouter>
        </>
    )
}
