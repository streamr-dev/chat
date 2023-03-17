import { ToastType } from '$/components/Toast'
import retoast from '$/features/toaster/helpers/retoast'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import handleError from '$/utils/handleError'
import { Contract, BigNumber } from 'ethers'
import { put, takeEvery } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import { Controller } from '$/features/toaster/helpers/toast'
import getRoomMetadata from '$/utils/getRoomMetadata'
import { RoomAction } from '..'
import getWalletProvider from '$/utils/getWalletProvider'
import { PermissionsAction } from '$/features/permissions'
import delegationPreflight from '$/utils/delegationPreflight'

const Abi = {
    [TokenStandard.ERC1155]: ERC1155JoinPolicyAbi,
    [TokenStandard.ERC20]: ERC20JoinPolicyAbi,
    [TokenStandard.ERC721]: ERC721JoinPolicyAbi,
    [TokenStandard.ERC777]: ERC777JoinPolicyAbi,
}

function* onLeaveTokenGatedRoom({
    payload: { roomId, requester, streamrClient },
}: ReturnType<typeof RoomAction.leaveTokenGatedRoom>) {
    let tc: Controller | undefined

    try {
        const stream: Stream = yield streamrClient.getStream(roomId)
        const {
            tokenAddress,
            tokenIds,
            tokenType,
            stakingEnabled = false,
        } = getRoomMetadata(stream)

        const delegatedAccount = yield* delegationPreflight(requester)

        if (!tokenAddress || !tokenType || tokenType.standard === TokenStandard.Unknown) {
            throw new Error('Room is not token gated')
        }

        tc = yield retoast(tc, {
            title: 'Leaving token gated room',
            type: ToastType.Processing,
        })

        const provider = yield* getWalletProvider()

        const policyRegistry = getJoinPolicyRegistry(provider)

        const policyAddress: string = yield policyRegistry.getPolicy(
            tokenAddress,
            BigNumber.from(tokenIds![0] || 0),
            roomId,
            stakingEnabled
        )

        const policy = new Contract(policyAddress, Abi[tokenType.standard], policyRegistry.signer)

        let txs: Record<string, any>[] = []
        if (
            tokenType.standard === TokenStandard.ERC721 ||
            tokenType.standard === TokenStandard.ERC1155
        ) {
            const tokenIds: BigNumber[] = yield policy.getStakedTokenIds(requester)
            txs = yield Promise.all(
                tokenIds.map((tokenId) => policy.requestDelegatedLeave(tokenId))
            )
        } else {
            txs.push(yield policy.requestDelegatedLeave())
        }

        yield Promise.all(txs.map((tx) => tx.wait()))

        yield put(PermissionsAction.invalidateAll({ roomId, address: requester }))

        yield put(PermissionsAction.invalidateAll({ roomId, address: delegatedAccount }))

        tc = yield retoast(tc, {
            title: 'Successfully left token gated room',
            type: ToastType.Success,
        })
    } catch (e) {
        handleError(e)

        tc = yield retoast(tc, {
            title: 'Failed to leave token gated room',
            type: ToastType.Error,
        })
    }
}

export default function* leaveTokenGatedRoom() {
    yield takeEvery(RoomAction.leaveTokenGatedRoom, onLeaveTokenGatedRoom)
}
