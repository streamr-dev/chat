import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import {
    useWeb3React,
    Web3ReactHooks,
    Web3ReactProvider,
} from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import type { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import {
    metaMask,
    hooks as metaMaskHooks,
} from '../utils/web3/connectors/metaMask'
import {
    walletConnect,
    hooks as walletConnectHooks,
} from '../utils/web3/connectors/walletConnect'
import {
    coinbaseWallet,
    hooks as coinbaseWalletHooks,
} from '../utils/web3/connectors/coinbaseWallet'
import { ReactNode } from 'react'

const connectors: [
    MetaMask | WalletConnect | CoinbaseWallet,
    Web3ReactHooks
][] = [
    [metaMask, metaMaskHooks],
    [walletConnect, walletConnectHooks],
    [coinbaseWallet, coinbaseWalletHooks],
]

type Props = {
    children?: ReactNode
}

export default function Web3Provider({ children }: Props) {
    return (
        <Web3ReactProvider connectors={connectors}>
            {children}
        </Web3ReactProvider>
    )
}
