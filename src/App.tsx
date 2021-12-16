import { createGlobalStyle } from 'styled-components'
import { PLEX } from './utils/css'

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
            H3110 world!
        </>
    )
}
