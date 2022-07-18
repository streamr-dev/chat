import { Contract, Wallet, providers } from 'ethers'
import * as DelegatedAccessRegistry from '../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'

import { sign, hash } from 'eth-crypto'
import handleError from '$/utils/handleError'
import { Address } from '$/types'

const DelegatedAccessRegistryAddress = '0xf5803cdA6352c515Ee11256EAA547BE8422cC4EE'

enum ChallengeType {
    Authorize = 0,
    Revoke = 1,
}

const signDelegatedChallenge = async (
    metamaskAddress: string,
    delegatedPrivateKey: string,
    challengeType: ChallengeType
) => {
    const message = hash.keccak256([
        { type: 'uint256', value: challengeType.toString() },
        { type: 'address', value: metamaskAddress },
    ])

    const signature = sign(delegatedPrivateKey, message)

    return signature
}

export default async function authorizeDelegatedAccount(
    metamaskAccount: Address,
    delegatedPrivateKey: string,
    rawProvider: any
) {
    try {
        const signature = await signDelegatedChallenge(metamaskAccount, delegatedPrivateKey, 0)

        const delegatedAddress = new Wallet(delegatedPrivateKey).address

        const ethereumProvider = new providers.Web3Provider(rawProvider)

        const contract = new Contract(
            DelegatedAccessRegistryAddress,
            DelegatedAccessRegistry.abi,
            ethereumProvider.getSigner()
        )

        const tx = await contract.functions.authorize(delegatedAddress, signature)

        await tx.wait()
    } catch (e) {
        handleError(e)
    }
}
