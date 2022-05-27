import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { Integration, WalletIntegrationId } from '../../features/wallet/types'
import { Matic } from '../chains'
import CoinbaseWalletIcon from './icons/CoinbaseWalletIcon'
import MetaMaskIcon from './icons/MetaMaskIcon'
import WalletConnectIcon from './icons/WalletConnectIcon'

const [
    chainId,
    {
        urls: [url],
    },
] = Matic

const integrations = new Map<WalletIntegrationId, Integration>()

integrations.set(WalletIntegrationId.MetaMask, {
    id: WalletIntegrationId.MetaMask,
    label: 'MetaMask',
    icon: MetaMaskIcon,
    initializer(actions: any): MetaMask {
        return new MetaMask(actions)
    },
})

integrations.set(WalletIntegrationId.CoinbaseWallet, {
    id: WalletIntegrationId.CoinbaseWallet,
    label: 'Coinbase Wallet',
    icon: CoinbaseWalletIcon,
    initializer(actions: any): CoinbaseWallet {
        return new CoinbaseWallet(actions, {
            url,
            appName: 'Streamr Chat',
        })
    },
})

integrations.set(WalletIntegrationId.WalletConnect, {
    id: WalletIntegrationId.WalletConnect,
    label: 'WalletConnect',
    icon: WalletConnectIcon,
    initializer(actions: any): WalletConnect {
        return new WalletConnect(actions, {
            rpc: [url],
        })
    },
    allowedChainIds: [chainId],
})

export default integrations
