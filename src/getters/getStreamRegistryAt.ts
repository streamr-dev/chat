import { Contract, providers } from 'ethers'
import { StreamRegistryV3 } from '../ethereum-contracts/StreamRegistryV3'
import * as _StreamRegistryArtifact from '../ethereum-contracts/StreamRegistryV3.json'

const StreamRegistryArtifact: { [key: string]: any } = _StreamRegistryArtifact

export default function getStreamRegistryAt(address: string): StreamRegistryV3 {
    const provider = new providers.WebSocketProvider(
        'wss://ws-matic-mainnet.chainstacklabs.com'
    )
    return new Contract(
        address,
        StreamRegistryArtifact.abi,
        provider
    ) as StreamRegistryV3
}
