import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect-v2'
import StreamrClient from '@streamr/sdk'

export enum WalletIntegrationId {
    MetaMask = 'metaMask',
    WalletConnect = 'walletConnect',
    CoinbaseWallet = 'coinbaseWallet',
}

export interface WalletState {
    account: string | undefined | null
    integrationId: WalletIntegrationId | undefined
    client: undefined | StreamrClient
    transactionalClient: undefined | StreamrClient
}

export type ConnectorMap = Partial<
    Record<WalletIntegrationId, ReturnType<typeof initializeConnector>>
>

export interface Integration {
    id: WalletIntegrationId
    initializer: (actions: any) => MetaMask | CoinbaseWallet | WalletConnect
}

interface Currency {
    decimals: number
    name: string
    symbol: string
}

interface Network {
    chainId: string
    chainName: string
    blockExplorerUrls?: string[]
    nativeCurrency?: Currency
    rpcUrls: string[]
}

export type Chain = [chainId: number, network: Network]
