import { Contract, providers, Signer } from 'ethers'
import { abi } from '$/contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'

const DelegatedAccessRegistryAddress = '0x0143825C65D59CD09F5c896d9DE8b7fe952bc5EB'

export default function getDelegatedAccessRegistry(signerOrProvider: Signer | providers.Provider) {
    return new Contract(DelegatedAccessRegistryAddress, abi, signerOrProvider)
}
