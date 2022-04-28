import { Contract, providers } from 'ethers'
import * as _StreamRegistryArtifact from '../ethereum-contracts/StreamRegistryV3.json'

const StreamRegistryArtifact: { [key: string]: any } = _StreamRegistryArtifact

export default function getStreamRegistryAt(address: string): any {
    // const provider = new providers.Web3Provider(ethereumProvider as any)
    const provider = new providers.WebSocketProvider(
        'wss://ws-matic-mainnet.chainstacklabs.com'
    )
    return new Contract(address, StreamRegistryArtifact.abi, provider) as any
}
