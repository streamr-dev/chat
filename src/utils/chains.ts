import { Chain } from '../../types/wallet'

export const Matic: Chain = [
    137,
    {
        blockExplorerUrls: ['https://polygonscan.com'],
        name: 'Polygon Mainnet',
        nativeCurrency: {
            decimals: 18,
            name: 'Matic',
            symbol: 'MATIC',
        },
        urls: ['https://polygon-rpc.com'],
    },
]
