import store from '../store'
import { Provider } from 'react-redux'
import { ReactNode } from 'react'
import Web3Provider from './Web3Provider'

type Props = {
    children: ReactNode
}

export default function RootProvider({ children }: Props) {
    return (
        <Provider store={store}>
            <Web3Provider>{children}</Web3Provider>
        </Provider>
    )
}
