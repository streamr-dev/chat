import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import handleError from '$/utils/handleError'
import { BigNumber, Contract } from 'ethers'
import { call } from 'redux-saga/effects'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import toast, { Controller } from '$/features/toaster/helpers/toast'
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
    tokenId,
}: ReturnType<typeof TokenGatedRoomAction.join>['payload']) {
    return call(function* () {
        let tc: Controller | undefined

        let dismissToast = false

        try {
            const policyRegistry = getJoinPolicyRegistry(provider)

            if (tokenType.hasIds && !tokenId) {
                yield toast({
                    title: `Token ID is required for ${tokenType.standard} tokens`,
                    type: ToastType.Error,
                })

                throw new Error('No token id')
            }

            const policyAddress: string = yield policyRegistry.getPolicy(
                tokenAddress,
                BigNumber.from(tokenId || 0),
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

            const tx: Record<string, any> = yield policy.requestDelegatedJoin(
                BigNumber.from(tokenId || 0)
            )

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
