import { Address } from '$/types'
import { getJoinPolicyFactory } from '$/features/tokenGatedRooms/utils/getJoinPolicyFactory'
import { call, put } from 'redux-saga/effects'
import { BigNumber, Contract } from 'ethers'
import { getJoinPolicy } from '$/features/tokenGatedRooms/utils/getJoinPolicy'
import { HexSerializedBigNumber, TokenType, TokenTypes } from '$/features/tokenGatedRooms/types'
import { MembersAction } from '$/features/members'
import { Flag } from '$/features/flag/types'
import { RoomId } from '$/features/room/types'
import { Provider } from '@web3-react/types'
import StreamrClient from 'streamr-client'

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

async function joinERC1155(
    factory: Contract,
    roomId: string,
    owner: Address,
    tokenAddress: Address,
    tokenId: BigNumber,
    provider: any,
    delegatedAccount: Address
) {
    const policyAddress = await factory.erc1155TokensToJoinPolicies(tokenAddress, tokenId, roomId)
    const policy = getJoinPolicy(policyAddress, provider, TokenTypes.ERC1155)
    const canJoin = await policy.canJoin(owner, tokenId)

    if (!canJoin) {
        throw new Error('Cannot join tokenGated room')
    }
    await policy.requestDelegatedJoin(delegatedAccount, tokenId)
}

export default function joinTokenGatedRoom(
    roomId: RoomId,
    owner: Address,
    tokenAddress: Address,
    provider: Provider,
    delegatedAccount: Address,
    tokenType: TokenType,
    tokenId: HexSerializedBigNumber,
    streamrClient: StreamrClient
) {
    return call(function* () {
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
            case 'ERC1155':
                yield joinERC1155(
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

        yield put(
            MembersAction.detect({
                roomId,
                streamrClient,
                provider,
                fingerprint: Flag.isDetectingMembers(roomId),
            })
        )
    })
}
