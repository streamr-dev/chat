import '../styles/globals.scss'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps): any {
    return <Component {...pageProps} />
}

export default MyApp
