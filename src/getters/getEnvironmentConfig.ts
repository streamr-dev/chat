import { ConfigTest } from 'streamr-client'

type EnvironmentConfig = {
    PolygonNetworkInfo: any
    StreamrClientConfig: any
    DelegatedAccessRegistryAddress: string
}

const ProductionConfig: EnvironmentConfig = {
    PolygonNetworkInfo: {
        chainId: 137,
        chainIdHex: `0x${(137).toString(16)}`,
        name: 'Polygon Mainnet',
        endpoint: `https://polygon-mainnet.infura.io/v3/`,
        blockExplorer: 'https://polygonscan.com/',
        rpcUrl: 'https://polygon-rpc.com/',
        decimals: 18,
        symbol: 'MATIC',
    },
    StreamrClientConfig: {},
    DelegatedAccessRegistryAddress:
        '0x52278782360728dC8516253fF0415B5c66f2abd7',
}

const DevConfig: EnvironmentConfig = {
    PolygonNetworkInfo: {
        chainId: 8995,
        chainIdHex: `0x${(8995).toString(16)}`,
        name: 'Streamr Local',
        endpoint: 'http://10.200.10.1:8545',
        blockExplorer: 'https://polygonscan.com/',
        rpcUrl: 'http://10.200.10.1:8545',
        decimals: 18,
        symbol: 'ETH',
    },
    DelegatedAccessRegistryAddress:
        '0x0A35Ca5e9A205096dBBC8f547ffD39f159dac2d5',
    StreamrClientConfig: {
        ...ConfigTest,
        streamRegistryChainRPCs: {
            chainId: 8995,
            name: 'streamr',
            rpcs: [
                {
                    url:
                        process.env.SIDECHAIN_URL ||
                        `http://${
                            process.env.STREAMR_DOCKER_DEV_HOST || '10.200.10.1'
                        }:8546`,
                    timeout: 30 * 1000,
                },
            ],
        },
    },
}

export default function getEnvironmentConfig(): EnvironmentConfig {
    if (process.env.REACT_APP_ENVIRONMENT === 'DEV') {
        return DevConfig
    }

    return ProductionConfig
}
