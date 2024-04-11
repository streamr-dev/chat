import { StreamRegistryAddress } from '$/consts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract, providers } from 'ethers'
import { StreamRegistryV3 } from '../contracts/StreamRegistryV3.sol/StreamRegistryV3'
import { abi } from '../contracts/StreamRegistryV3.sol/StreamRegistryV3.json'

let streamRegistry: undefined | StreamRegistryV3

export function getStreamRegistry() {
    if (!streamRegistry) {
        streamRegistry = new Contract(
            StreamRegistryAddress,
            abi,
            getJsonRpcProvider()
        ) as StreamRegistryV3
    }

    return streamRegistry
}

let jsonRpcProvider: undefined | JsonRpcProvider

export function getJsonRpcProvider() {
    if (!jsonRpcProvider) {
        jsonRpcProvider = new providers.JsonRpcProvider('https://polygon-rpc.com')
    }

    return jsonRpcProvider
}
