function getInfuraUrl(infuraId: string, prefix = 'mainnet') {
    return infuraId ? `https://${prefix}.infura.io/v3/${infuraId}` : void 0
}

function compact(array: any[]) {
    return array.filter(Boolean)
}

const ETH = {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
}

const MATIC = {
    decimals: 18,
    name: 'Matic',
    symbol: 'MATIC',
}

type Network = {
    name: string
    blockExplorerUrls?: string[]
    nativeCurrency?: {
        decimals: number
        name: string
        symbol: string
    }
    urls: string[]
}

type Networks = {
    [networkId: string]: Network
}

type Cache = {
    [infuraId: string]: Networks
}

const cache: Cache = {}

type Chain = [number, Network]

export default function getChains(infuraId = '') {
    if (cache[infuraId]) {
        return cache[infuraId]
    }

    const chains: Chain[] = [
        [
            1,
            {
                name: 'Mainnet',
                urls: compact([
                    getInfuraUrl(infuraId),
                    'https://cloudflare-eth.com',
                ]),
            },
        ],
        [
            3,
            {
                name: 'Ropsten',
                urls: compact([getInfuraUrl(infuraId, 'ropsten')]),
            },
        ],
        [
            4,
            {
                name: 'Rinkeby',
                urls: compact([getInfuraUrl(infuraId, 'rinkeby')]),
            },
        ],
        [
            5,
            {
                name: 'Görli',
                urls: compact([getInfuraUrl(infuraId, 'goerli')]),
            },
        ],
        [
            42,
            {
                name: 'Kovan',
                urls: compact([getInfuraUrl(infuraId, 'kovan')]),
            },
        ],
        [
            10,
            {
                blockExplorerUrls: ['https://optimistic.etherscan.io'],
                name: 'Optimism',
                nativeCurrency: ETH,
                urls: compact([
                    getInfuraUrl(infuraId, 'optimism-mainnet'),
                    'https://mainnet.optimism.io',
                ]),
            },
        ],
        [
            69,
            {
                blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
                name: 'Optimism Kovan',
                nativeCurrency: ETH,
                urls: compact([
                    getInfuraUrl(infuraId, 'optimism-kovan'),
                    'https://kovan.optimism.io',
                ]),
            },
        ],
        [
            42161,
            {
                blockExplorerUrls: ['https://arbiscan.io'],
                name: 'Arbitrum One',
                nativeCurrency: ETH,
                urls: compact([
                    getInfuraUrl(infuraId, 'arbitrum-mainnet'),
                    'https://arb1.arbitrum.io/rpc',
                ]),
            },
        ],
        [
            421611,
            {
                blockExplorerUrls: ['https://testnet.arbiscan.io'],
                name: 'Arbitrum Testnet',
                nativeCurrency: ETH,
                urls: compact([
                    getInfuraUrl(infuraId, 'arbitrum-rinkeby'),
                    'https://rinkeby.arbitrum.io/rpc',
                ]),
            },
        ],
        [
            137,
            {
                blockExplorerUrls: ['https://polygonscan.com'],
                name: 'Polygon Mainnet',
                nativeCurrency: MATIC,
                urls: compact([
                    getInfuraUrl(infuraId, 'polygon-mainnet'),
                    'https://polygon-rpc.com',
                ]),
            },
        ],
        [
            80001,
            {
                blockExplorerUrls: ['https://mumbai.polygonscan.com'],
                name: 'Polygon Mumbai',
                nativeCurrency: MATIC,
                urls: compact([getInfuraUrl(infuraId, 'polygon-mumbai')]),
            },
        ],
    ]

    const result: Networks = {}

    chains.forEach(([id, props]) => {
        if (props.urls.length) {
            result[id] = props
        }
    })

    cache[infuraId] = result

    return result
}
