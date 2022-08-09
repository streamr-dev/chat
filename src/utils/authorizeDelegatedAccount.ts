import { Wallet } from 'ethers'
import { sign, hash } from 'eth-crypto'
import { Address } from '$/types'
import { getDelegatedAccessRegistry } from '$/utils/DelegatedAccessRegistry'

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

    const contract = getDelegatedAccessRegistry(rawProvider)

    const tx = await contract.functions.authorize(delegatedAddress, signature)

    await tx.wait()
}
