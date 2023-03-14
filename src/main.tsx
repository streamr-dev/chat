import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'
import App from './App'
import './fonts/Karelia.css'
import 'twin.macro'

const root = document.getElementById('root')

if (root) {
    ReactDOM.createRoot(root).render(
        <StrictMode>
            <App />
        </StrictMode>
    )
} else {
    throw new Error('Missing `#root`. Check `document.getElementById("root")`.')
}
