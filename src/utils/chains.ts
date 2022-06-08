import { Chain } from '../features/wallet/types'

export const Matic: Chain = [
    137,
    {
        chainId: '0x89',
        blockExplorerUrls: ['https://polygonscan.com'],
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
            decimals: 18,
            name: 'Matic',
            symbol: 'MATIC',
        },
        rpcUrls: ['https://polygon-rpc.com'],
    },
]
