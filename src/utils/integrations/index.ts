import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect-v2'
import { Integration, WalletIntegrationId } from '$/features/wallet/types'
import { Matic } from '$/utils/chains'

const [
    chainId,
    {
        rpcUrls: [url],
    },
] = Matic

const integrations = new Map<WalletIntegrationId, Integration>()

integrations.set(WalletIntegrationId.MetaMask, {
    id: WalletIntegrationId.MetaMask,
    initializer(actions: any): MetaMask {
        return new MetaMask({ actions })
    },
})

integrations.set(WalletIntegrationId.CoinbaseWallet, {
    id: WalletIntegrationId.CoinbaseWallet,
    initializer(actions: any): CoinbaseWallet {
        return new CoinbaseWallet({
            actions,
            options: {
                url,
                appName: 'Streamr Chat',
            },
        })
    },
})

integrations.set(WalletIntegrationId.WalletConnect, {
    id: WalletIntegrationId.WalletConnect,
    initializer(actions: any): WalletConnect {
        return new WalletConnect({
            actions,
            options: {
                showQrModal: true,
                rpc: {
                    [chainId]: url,
                },
                projectId: '3329d87879d2b4db0032d7b9502a7609',
                chains: [chainId],
            },
            defaultChainId: chainId,
        })
    },
})

export default integrations
