import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { selectWalletProvider } from '$/features/wallet/selectors'
import { Address, OptionalAddress } from '$/types'
import delegationPreflight from '$/utils/delegationPreflight'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import handleError from '$/utils/handleError'
import { Provider } from '@web3-react/types'
import { call, select } from 'redux-saga/effects'
import { BigNumber, Contract } from 'ethers'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import { Controller } from '$/features/toaster/helpers/toast'
import retoast from '$/features/toaster/helpers/retoast'
import { ToastType } from '$/components/Toast'
import waitForPermission from '$/utils/waitForPermission'
import { Stream, StreamPermission } from 'streamr-client'
import getRoomMetadata from '$/utils/getRoomMetadata'

const Abi = {
    [TokenStandard.ERC1155]: ERC1155JoinPolicyAbi,
    [TokenStandard.ERC20]: ERC20JoinPolicyAbi,
    [TokenStandard.ERC721]: ERC721JoinPolicyAbi,
    [TokenStandard.ERC777]: ERC777JoinPolicyAbi,
}

export default function join(stream: Stream, requester: Address) {
    return call(function* () {
        let tc: Controller | undefined

        let dismissToast = false

        const roomId = stream.id

        const tokenId = 0 // @FIXME!

        const { tokenAddress, tokenType, stakingEnabled = false } = getRoomMetadata(stream)

        try {
            if (!tokenAddress) {
                tc = yield retoast(tc, {
                    title: "It's not a token gated room",
                    type: ToastType.Error,
                })

                dismissToast = false

                return
            }

            if (!tokenType) {
                throw new Error('Invalid token type')
            }

            const { standard: tokenStandard } = tokenType

            if (tokenStandard === TokenStandard.Unknown) {
                throw new Error('Unknown token standard')
            }

            const provider: Provider | undefined = yield select(selectWalletProvider)

            if (!provider) {
                throw new Error('No provider')
            }

            tc = yield retoast(tc, {
                title: 'Joining…',
                type: ToastType.Processing,
            })

            dismissToast = true

            const delegatedAccount: OptionalAddress = yield delegationPreflight({
                requester,
                provider,
            })

            if (!delegatedAccount) {
                throw new Error('No delegated account')
            }

            const policyRegistry = getJoinPolicyRegistry(provider)

            // Get token id

            const policyAddress: string = yield policyRegistry.getPolicy(
                tokenAddress,
                BigNumber.from(tokenId || 0),
                roomId,
                stakingEnabled
            )

            const policy = new Contract(policyAddress, Abi[tokenStandard], policyRegistry.signer)

            try {
                const tx: Record<string, any> = yield policy.requestDelegatedJoin()

                yield tx.wait()
            } catch (e: any) {
                if (typeof e?.message === 'string' && /error_notEnoughTokens/.test(e.message)) {
                    tc = yield retoast(tc, {
                        title: 'Not enough tokens',
                        type: ToastType.Error,
                        autoCloseAfter: 5,
                    })

                    dismissToast = false

                    return
                }

                throw e
            }

            tc = yield retoast(tc, {
                title: 'Checking permissions…',
                type: ToastType.Processing,
            })

            dismissToast = true

            yield waitForPermission({
                stream,
                account: requester,
                permission: StreamPermission.PUBLISH,
            })

            yield waitForPermission({
                stream,
                account: delegatedAccount,
                permission: StreamPermission.PUBLISH,
            })

            tc = yield retoast(tc, {
                title: 'Joined!',
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
