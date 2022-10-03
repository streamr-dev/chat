import { Address } from '$/types'
import { getJoinPolicyFactory } from '$/features/tokenGatedRooms/utils/getJoinPolicyFactory'
import { takeEvery } from 'redux-saga/effects'
import { BigNumber, Contract } from 'ethers'
import { getJoinPolicy } from '$/features/tokenGatedRooms/utils/getJoinPolicy'
import { TokenTypes } from '$/features/tokenGatedRooms/types'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import handleError from '$/utils/handleError'

async function joinERC20(
    factory: Contract,
    roomId: string,
    owner: Address,
    tokenAddress: Address,
    provider: any,
    delegatedAccount: Address
) {
    const policyAddress = await factory.erc20TokensToJoinPolicies(tokenAddress, roomId)
    const policy = getJoinPolicy(policyAddress, provider, TokenTypes.ERC20)
    const canJoin = await policy.canJoin(owner)
    if (!canJoin) {
        throw new Error('Cannot join tokenGated room')
    }
    await policy.requestDelegatedJoin(delegatedAccount)
}

async function joinERC721(
    factory: Contract,
    roomId: string,
    owner: Address,
    tokenAddress: Address,
    tokenId: BigNumber,
    provider: any,
    delegatedAccount: Address
) {
    const policyAddress = await factory.erc721TokensToJoinPolicies(tokenAddress, tokenId, roomId)
    const policy = getJoinPolicy(policyAddress, provider, TokenTypes.ERC721)
    const canJoin = await policy.canJoin(owner, tokenId)

    if (!canJoin) {
        throw new Error('Cannot join tokenGated room')
    }
    await policy.requestDelegatedJoin(delegatedAccount, tokenId)
}

function* onJoinTokenGatedRoom({
    payload: { roomId, owner, tokenAddress, provider, delegatedAccount, tokenType, tokenId },
}: ReturnType<typeof TokenGatedRoomAction.join>) {
    try {
        const factory = getJoinPolicyFactory(provider)

        switch (tokenType.standard) {
            case 'ERC20':
                yield joinERC20(factory, roomId, owner, tokenAddress, provider, delegatedAccount)
                break
            case 'ERC721':
                yield joinERC721(
                    factory,
                    roomId,
                    owner,
                    tokenAddress,
                    BigNumber.from(tokenId),
                    provider,
                    delegatedAccount
                )
                break
            default:
                throw new Error('Invalid token type')
        }
        /*
        yield put(
            MembersAction.detect({
                roomId,
                streamrClient,
                provider,
                fingerprint: Flag.isDetectingMembers(roomId),
            })
        )*/
    } catch (e) {
        handleError(e)
    }
}

export default function* registerPolicy() {
    yield takeEvery(TokenGatedRoomAction.join, onJoinTokenGatedRoom)
}
