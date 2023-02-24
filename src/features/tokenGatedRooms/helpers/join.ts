import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import getPolicyRegistry from '$/features/tokenGatedRooms/utils/getPolicyRegistry'
import handleError from '$/utils/handleError'
import { Contract } from 'ethers'
import { call } from 'redux-saga/effects'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import { Controller } from '$/features/toaster/helpers/toast'
import retoast from '$/features/toaster/helpers/retoast'
import { ToastType } from '$/components/Toast'

const Abi: Record<
    TokenStandard,
    | typeof ERC20JoinPolicyAbi
    | typeof ERC721JoinPolicyAbi
    | typeof ERC777JoinPolicyAbi
    | typeof ERC1155JoinPolicyAbi
    | null
> = {
    [TokenStandard.ERC1155]: ERC1155JoinPolicyAbi,
    [TokenStandard.ERC20]: ERC20JoinPolicyAbi,
    [TokenStandard.ERC721]: ERC721JoinPolicyAbi,
    [TokenStandard.ERC777]: ERC777JoinPolicyAbi,
    [TokenStandard.Unknown]: null,
}

export default function join({
    roomId,
    tokenAddress,
    provider,
    stakingEnabled,
    tokenType,
}: ReturnType<typeof TokenGatedRoomAction.join>['payload']) {
    return call(function* () {
        let tc: Controller | undefined

        let dismissToast = false

        try {
            const policyRegistry = getPolicyRegistry(provider)

            const policyAddress: string = yield policyRegistry.getPolicy(
                tokenAddress,
                0, // tokenId = 0 for erc20
                roomId,
                stakingEnabled
            )

            const abi = Abi[tokenType.standard]

            if (!abi) {
                throw new Error(`Unsupported token type: ${tokenType.standard}`)
            }

            const policy = new Contract(policyAddress, abi, policyRegistry.signer)

            tc = yield retoast(tc, {
                title: 'Joining…',
                type: ToastType.Processing,
            })

            dismissToast = true

            const tx: Record<string, any> = yield policy.requestDelegatedJoin()

            yield tx.wait()

            tc = yield retoast(tc, {
                title: 'Joined',
                type: ToastType.Success,
            })

            dismissToast = false
        } catch (e) {
            handleError(e)

            tc = yield retoast(tc, {
                title: 'Failed to join',
                type: ToastType.Error,
            })

            dismissToast = false
        } finally {
            if (dismissToast) {
                tc?.dismiss()
            }
        }
    })
}
