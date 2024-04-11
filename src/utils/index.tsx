import { JSON_RPC_URL, StreamRegistryAddress } from '$/consts'
import { Contract, providers } from 'ethers'
import { StreamRegistryV3 } from '../contracts/StreamRegistryV3.sol/StreamRegistryV3'
import { abi } from '../contracts/StreamRegistryV3.sol/StreamRegistryV3.json'

let streamRegistry: undefined | StreamRegistryV3

export function getStreamRegistry() {
    if (!streamRegistry) {
        streamRegistry = new Contract(
            StreamRegistryAddress,
            abi,
            new providers.JsonRpcProvider(JSON_RPC_URL)
        ) as StreamRegistryV3
    }

    return streamRegistry
}
