import { Contract, Wallet, providers } from 'ethers'
import { sign, hash } from 'eth-crypto'
import { Address } from '$/types'

import * as DelegatedAccessRegistry from '../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'

const DelegatedAccessRegistryAddress = '0xf5803cdA6352c515Ee11256EAA547BE8422cC4EE'

enum ChallengeType {
    Authorize = 0,
    Revoke = 1,
}

const signDelegatedChallenge = (
    metamaskAddress: string,
    delegatedPrivateKey: string,
    challengeType: ChallengeType
) => {
    const message = hash.keccak256([
        { type: 'uint256', value: challengeType.toString() },
        { type: 'address', value: metamaskAddress },
    ])

    return sign(delegatedPrivateKey, message)
}

export default async function authorizeDelegatedAccount(
    metamaskAccount: Address,
    delegatedPrivateKey: string,
    rawProvider: any
) {
    const signature = signDelegatedChallenge(
        metamaskAccount,
        delegatedPrivateKey,
        ChallengeType.Authorize
    )

    const delegatedAddress = new Wallet(delegatedPrivateKey).address

    const ethereumProvider = new providers.Web3Provider(rawProvider)

    const contract = new Contract(
        DelegatedAccessRegistryAddress,
        DelegatedAccessRegistry.abi,
        ethereumProvider.getSigner()
    )

    const tx = await contract.functions.authorize(delegatedAddress, signature)

    await tx.wait()
}
