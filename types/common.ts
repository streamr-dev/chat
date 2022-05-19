import { FC, ReactNode } from 'react'

export interface DefaultProps {
    className?: string
    children?: ReactNode
}

export enum AdapterId {
    MetaMask = 'metaMask',
    WalletConnect = 'walletConnect',
    CoinbaseWallet = 'coinbaseWallet',
}

export type WalletAdapter = {
    id: AdapterId
    label: string
    getConnector: () => [any, any]
    icon: FC
}
