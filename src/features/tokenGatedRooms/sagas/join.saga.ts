import { Address, EnhancedStream } from '$/types'
import { put, takeEvery } from 'redux-saga/effects'
import { Contract } from 'ethers'
import { TokenTypes } from '$/features/tokenGatedRooms/types'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import handleError from '$/utils/handleError'
import { success } from '$/utils/toaster'
import { MembersAction } from '$/features/members'
import { Flag } from '$/features/flag/types'
import { TransactionResponse } from '@ethersproject/providers'
import { getJoinPolicy, getJoinPolicyFactory } from '$/features/tokenGatedRooms/utils'

function* onJoinTokenGatedRoom({
    payload: { roomId, provider, delegatedAccount, streamrClient },
}: ReturnType<typeof TokenGatedRoomAction.join>) {
    try {
        const stream: EnhancedStream = yield streamrClient.getStream(roomId)
        const { tokenAddress, tokenType, tokenId } = stream.extensions['thechat.eth']

        if (!tokenAddress || !tokenType) {
            throw new Error('No token address or token type found')
        }
        const factory = getJoinPolicyFactory(provider)

        let policyAddress: Address
        let policy: Contract
        let tx: TransactionResponse

        switch (tokenType.standard) {
            case 'ERC20':
                policyAddress = yield factory.erc20TokensToJoinPolicies(tokenAddress, roomId)
                policy = getJoinPolicy(policyAddress, provider, TokenTypes.ERC20)
                tx = yield policy.requestDelegatedJoin(delegatedAccount)
                break
            case 'ERC721':
                if (!tokenId) {
                    throw new Error('No token id found')
                }
                policyAddress = yield factory.erc721TokensToJoinPolicies(
                    tokenAddress,
                    tokenId,
                    roomId
                )
                policy = getJoinPolicy(policyAddress, provider, TokenTypes.ERC721)
                tx = yield policy.requestDelegatedJoin(delegatedAccount, tokenId)
                break
            default:
                throw new Error('Invalid token type')
        }

        yield tx.wait()

        yield put(
            MembersAction.detect({
                roomId,
                streamrClient,
                provider,
                fingerprint: Flag.isDetectingMembers(roomId),
            })
        )
        success('Joined tokenGated room')
    } catch (e) {
        handleError(e)
    }
}

export default function* registerPolicy() {
    yield takeEvery(TokenGatedRoomAction.join, onJoinTokenGatedRoom)
}
