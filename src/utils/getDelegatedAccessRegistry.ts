import { Contract, providers, Signer } from 'ethers'
import { abi } from '$/contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'

const DelegatedAccessRegistryAddress = '0x7D7272C07705a5729b5D229c15192455Fa2b1eb4'

export default function getDelegatedAccessRegistry(signerOrProvider: Signer | providers.Provider) {
    return new Contract(DelegatedAccessRegistryAddress, abi, signerOrProvider)
}
