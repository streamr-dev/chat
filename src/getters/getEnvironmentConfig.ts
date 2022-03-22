import { ChatState } from '../utils/types'
import { StreamrClient, ConfigTest, Config } from 'streamr-client'

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
    StreamrClientConfig: Config,
    DelegatedAccessRegistryAddress: ''
}

const DevConfig: EnvironmentConfig = {
    PolygonNetworkInfo: {
        chainId: 8995,
        chainIdHex: `0x${(8995).toString(16)}`,
        name: 'Streamr Local',
        endpoint: 'http://10.200.10.1:8545',
        blockExplorer: 'https://polygonscan.com/',
        rpcUrl: 'https://localhost:8545',
        decimals: 18,
        symbol: 'ETH',
    },
    StreamrClientConfig: ConfigTest,
    DelegatedAccessRegistryAddress: '0x56e57Bf7422eDe1ED75520D4387829feEe8a8319'
}

export default function getEnvironmentConfig(): EnvironmentConfig {
    console.info('environment', process.env.REACT_APP_ENVIRONMENT)

    if (process.env.REACT_APP_ENVIRONMENT === 'DEV'){
        return DevConfig
    }

    return ProductionConfig
}
