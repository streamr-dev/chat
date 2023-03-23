import { Contract, providers, Signer } from 'ethers'
import { JoinPolicyRegistryAddress } from '$/consts'
import { abi } from '$/contracts/JoinPolicyRegistry.sol/JoinPolicyRegistry.json'

export default function getJoinPolicyRegistry(signerOrProvider: Signer | providers.Provider) {
    return new Contract(JoinPolicyRegistryAddress, abi, signerOrProvider)
}
