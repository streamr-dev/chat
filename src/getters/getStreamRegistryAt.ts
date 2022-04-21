import { MetaMaskInpageProvider } from '@metamask/providers'
import { Contract, providers } from 'ethers'
import * as _StreamRegistryArtifact from '../ethereum-contracts/StreamRegistryV3.json'

const StreamRegistryArtifact: { [key: string]: any } = _StreamRegistryArtifact

export default function getStreamRegistryAt({
    address,
    ethereumProvider,
}: {
    address: string
    ethereumProvider: MetaMaskInpageProvider
}): any {
    const provider = new providers.Web3Provider(ethereumProvider as any)

    return new Contract(address, StreamRegistryArtifact.abi, provider) as any
}
