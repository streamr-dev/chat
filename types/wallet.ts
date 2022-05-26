import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Provider } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { FC } from 'react'

export enum WalletIntegrationId {
    MetaMask = 'metaMask',
    WalletConnect = 'walletConnect',
    CoinbaseWallet = 'coinbaseWallet',
}

export type WalletState = {
    account: string | undefined | null
    integrationId: WalletIntegrationId | undefined
    provider: Provider | undefined
}

export type ConnectorMap = {
    [index: string]: ReturnType<typeof initializeConnector>
}

export interface Integration {
    id: WalletIntegrationId
    label: string
    icon: FC
    initializer: (actions: any) => MetaMask | CoinbaseWallet | WalletConnect
    allowedChainIds?: number[]
}

type Currency = {
    decimals: number
    name: string
    symbol: string
}

type Network = {
    name: string
    blockExplorerUrls?: string[]
    nativeCurrency?: Currency
    urls: string[]
}

export type Chain = [chainId: number, network: Network]
