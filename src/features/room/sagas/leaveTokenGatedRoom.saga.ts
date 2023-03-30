import { ToastType } from '$/components/Toast'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import handleError from '$/utils/handleError'
import { Contract, BigNumber, providers } from 'ethers'
import { cancelled, put, takeEvery } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import getRoomMetadata from '$/utils/getRoomMetadata'
import { RoomAction } from '..'
import { PermissionsAction } from '$/features/permissions'
import delegationPreflight from '$/utils/delegationPreflight'
import fetchStream from '$/utils/fetchStream'
import i18n from '$/utils/i18n'
import networkPreflight from '$/utils/networkPreflight'
import { JSON_RPC_URL } from '$/consts'
import retoast from '$/features/misc/helpers/retoast'
import { Address } from '$/types'

const Abi = {
    [TokenStandard.ERC1155]: ERC1155JoinPolicyAbi,
    [TokenStandard.ERC20]: ERC20JoinPolicyAbi,
    [TokenStandard.ERC721]: ERC721JoinPolicyAbi,
    [TokenStandard.ERC777]: ERC777JoinPolicyAbi,
}

function* onLeaveTokenGatedRoom({
    payload: { roomId, requester },
}: ReturnType<typeof RoomAction.leaveTokenGatedRoom>) {
    const toast = retoast()

    try {
        const stream: Stream = yield fetchStream(roomId)

        const {
            tokenAddress,
            tokenIds = [],
            tokenType,
            stakingEnabled = false,
        } = getRoomMetadata(stream)

        const delegatedAccount: Address = yield delegationPreflight(requester)

        if (!tokenAddress || !tokenType || tokenType.standard === TokenStandard.Unknown) {
            throw new Error('Room is not token gated')
        }

        yield toast.pop({
            title: i18n('tokenGateToast.leaving'),
            type: ToastType.Processing,
        })

        yield networkPreflight()

        const policyRegistry = getJoinPolicyRegistry(new providers.JsonRpcProvider(JSON_RPC_URL))
        const policyAddress: string = yield policyRegistry.getPolicy(
            tokenAddress,
            BigNumber.from(tokenIds[0] || 0),
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

        toast.pop({
            title: i18n('tokenGateToast.leaveSuccess'),
            type: ToastType.Success,
        })
    } catch (e) {
        handleError(e)

        toast.pop({
            title: i18n('tokenGateToast.leaveFailed'),
            type: ToastType.Error,
        })
    } finally {
        toast.discard({ asap: yield cancelled() })
    }
}

export default function* leaveTokenGatedRoom() {
    yield takeEvery(RoomAction.leaveTokenGatedRoom, onLeaveTokenGatedRoom)
}
