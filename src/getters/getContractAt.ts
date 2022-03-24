import { Contract, providers } from 'ethers'

import * as _ERC20JoinPolicyArtifact from '../artifacts/ERC20JoinPolicy.json'
import * as _DelegatedAccessRegistryArtifact from '../artifacts/DelegatedAccessRegistry.json'

const ERC20JoinPolicyArtifact = _ERC20JoinPolicyArtifact as {
    [key: string]: any
}
const DelegatedAccessRegistryArtifact = _DelegatedAccessRegistryArtifact as {
    [key: string]: any
}

const ArtifactsToContracts: { [key: string]: any } = {
    ERC20JoinPolicy: ERC20JoinPolicyArtifact,
    DelegatedAccessRegistry: DelegatedAccessRegistryArtifact,
}

type Options = {
    address: string
    artifact: 'ERC20JoinPolicy' | 'DelegatedAccessRegistry'
    provider: any
}

export default function getContractAt({
    address,
    artifact,
    provider,
}: Options): Contract {
    return new Contract(
        address,
        ArtifactsToContracts[artifact].abi,
        new providers.Web3Provider(provider).getSigner()
    )
}
