import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { selectWalletClient, selectWalletProvider } from '$/features/wallet/selectors'
import { Address, OptionalAddress } from '$/types'
import delegationPreflight from '$/utils/delegationPreflight'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import handleError from '$/utils/handleError'
import { Provider } from '@web3-react/types'
import { call, put, select } from 'redux-saga/effects'
import { BigNumber, Contract } from 'ethers'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import Toast, { ToastType } from '$/components/Toast'
import StreamrClient, { Stream } from 'streamr-client'
import getRoomMetadata from '$/utils/getRoomMetadata'
import Id from '$/components/Id'
import { ComponentProps } from 'react'
import { Controller } from '$/features/toaster/helpers/toast'
import retoast from '$/features/toaster/helpers/retoast'
import { Controller as ToastController } from '$/components/Toaster'
import { PermissionsAction } from '$/features/permissions'
import { RoomAction } from '$/features/room'
import waitForPermissions from '$/utils/waitForPermissions'
import isSameAddress from '$/utils/isSameAddress'
import tokenIdPreflight from '$/utils/tokenIdPreflight'

const Abi = {
    [TokenStandard.ERC1155]: ERC1155JoinPolicyAbi,
    [TokenStandard.ERC20]: ERC20JoinPolicyAbi,
    [TokenStandard.ERC721]: ERC721JoinPolicyAbi,
    [TokenStandard.ERC777]: ERC777JoinPolicyAbi,
}

interface Options {
    onToast?: (props: ComponentProps<typeof Toast>) => void
}

export default function join(
    stream: Stream,
    requester: Address,
    { onToast: onToastProp }: Options = {}
) {
    return call(function* () {
        const roomId = stream.id

        const { name, tokenAddress, tokenType, stakingEnabled = false } = getRoomMetadata(stream)

        let tc: Controller | undefined

        let tokenIdTc: ToastController<typeof Toast> | undefined

        let dismissToast = false

        function onToast(props: ComponentProps<typeof Toast>) {
            return call(function* () {
                if (!onToastProp) {
                    tc = yield retoast(tc, props)

                    dismissToast = props.type === ToastType.Processing

                    return
                }

                onToastProp(props)
            })
        }

        try {
            if (!tokenAddress) {
                yield onToast({
                    title: "It's not a token gated room",
                    type: ToastType.Error,
                })

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

            yield onToast({
                title: <>Joining {name ? `"${name}"` : <Id>{roomId}</Id>}…</>,
                type: ToastType.Processing,
            })

            let tokenId = '0'

            if (tokenType.hasIds) {
                tokenId = yield* tokenIdPreflight({
                    tokenStandard,
                })
            }

            const delegatedAccount: OptionalAddress = yield delegationPreflight({
                requester,
                provider,
            })

            if (!delegatedAccount) {
                throw new Error('No delegated account')
            }

            const policyRegistry = getJoinPolicyRegistry(provider)

            const policyAddress: string = yield policyRegistry.getPolicy(
                tokenAddress,
                BigNumber.from(tokenId),
                roomId,
                stakingEnabled
            )

            const policy = new Contract(policyAddress, Abi[tokenStandard], policyRegistry.signer)

            try {
                const tx: Record<string, any> = yield policy.requestDelegatedJoin()

                yield tx.wait()
            } catch (e: any) {
                if (typeof e?.message === 'string' && /error_notEnoughTokens/.test(e.message)) {
                    yield onToast({
                        title: 'Not enough tokens',
                        type: ToastType.Error,
                        autoCloseAfter: 5,
                    })

                    return
                }

                throw e
            }

            yield onToast({
                title: 'Checking permissions…',
                type: ToastType.Processing,
            })

            const streamrClient: StreamrClient | undefined = yield select(selectWalletClient)

            if (streamrClient) {
                yield waitForPermissions(streamrClient, roomId, (assignments) => {
                    for (let i = 0; i < assignments.length; i++) {
                        const assignment = assignments[i]

                        if ('public' in assignment) {
                            continue
                        }

                        if (
                            isSameAddress(assignment.user, requester) &&
                            assignment.permissions.length
                        ) {
                            return true
                        }
                    }

                    return false
                })

                yield put(PermissionsAction.invalidateAll({ roomId, address: requester }))

                yield put(PermissionsAction.invalidateAll({ roomId, address: delegatedAccount }))

                yield put(
                    RoomAction.fetch({
                        roomId,
                        requester,
                        streamrClient,
                    })
                )
            }

            yield onToast({
                title: 'Joined!',
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield onToast({
                title: 'Failed to join',
                type: ToastType.Error,
            })
        } finally {
            if (dismissToast) {
                tc?.dismiss()
            }

            tokenIdTc?.dismiss()
        }
    })
}
