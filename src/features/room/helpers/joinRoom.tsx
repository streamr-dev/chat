import { ToastType } from '$/components/Toast'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import retoast, { RetoastController } from '$/features/misc/helpers/retoast'
import { PermissionsAction } from '$/features/permissions'
import { RoomAction } from '$/features/room'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { Address } from '$/types'
import { getJsonRpcProvider } from '$/utils'
import delegationPreflight from '$/utils/delegationPreflight'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import getRoomMetadata from '$/utils/getRoomMetadata'
import getSigner from '$/utils/getSigner'
import getTransactionalClient from '$/utils/getTransactionalClient'
import getWalletProvider from '$/utils/getWalletProvider'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import isSameAddress from '$/utils/isSameAddress'
import recover from '$/utils/recover'
import tokenIdPreflight from '$/utils/tokenIdPreflight'
import waitForPermissions from '$/utils/waitForPermissions'
import StreamrClient, { Stream } from '@streamr/sdk'
import { BigNumber, Contract } from 'ethers'
import { call, cancelled, put } from 'redux-saga/effects'

const Abi = {
    [TokenStandard.ERC1155]: ERC1155JoinPolicyAbi,
    [TokenStandard.ERC20]: ERC20JoinPolicyAbi,
    [TokenStandard.ERC721]: ERC721JoinPolicyAbi,
    [TokenStandard.ERC777]: ERC777JoinPolicyAbi,
}

interface Options {
    retoastConstroller?: RetoastController
}

export default function joinRoom(
    stream: Stream,
    requester: Address,
    { retoastConstroller }: Options = {}
) {
    return call(function* () {
        const roomId = stream.id

        const { name, tokenAddress, tokenType, stakingEnabled = false } = getRoomMetadata(stream)

        const toast = retoastConstroller || retoast()

        try {
            if (!tokenAddress) {
                yield toast.pop({
                    title: i18n('joinTokenGatedRoomToast.notTokenGatedTitle'),
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

            const provider = yield* getWalletProvider()

            yield toast.pop({
                title: i18n('joinTokenGatedRoomToast.joiningTitle', name, roomId),
                type: ToastType.Processing,
            })

            let tokenId = '0'

            if (tokenType.hasIds) {
                tokenId = yield* tokenIdPreflight(tokenStandard)
            }

            const delegatedAccount: Address = yield delegationPreflight(requester)

            const policyRegistry = getJoinPolicyRegistry(getJsonRpcProvider())

            const policyAddress: string = yield policyRegistry.getPolicy(
                tokenAddress,
                BigNumber.from(tokenId),
                roomId,
                stakingEnabled
            )

            const policy = new Contract(policyAddress, Abi[tokenStandard], getSigner(provider))

            const ok = yield* recover(
                function* () {
                    try {
                        const tx: Record<string, any> = yield policy.requestDelegatedJoin()

                        yield tx.wait()

                        return true
                    } catch (e: any) {
                        if (
                            typeof e?.message === 'string' &&
                            /error_notEnoughTokens/.test(e.message)
                        ) {
                            yield toast.pop({
                                title: i18n('joinTokenGatedRoomToast.insufficientFundsTitle'),
                                type: ToastType.Error,
                                autoCloseAfter: 5,
                            })

                            return false
                        }

                        if (typeof e?.message === 'string' && /ACTION_REJECTED/.test(e.message)) {
                            yield toast.pop({
                                title: i18n('anonToast.cancelledTitle'),
                                type: ToastType.Info,
                            })

                            return false
                        }

                        throw e
                    }
                },
                {
                    title: i18n('joinTokenGatedRecoverToast.title'),
                    desc: i18n('joinTokenGatedRecoverToast.desc'),
                    okLabel: i18n('joinTokenGatedRecoverToast.okLabel'),
                    cancelLabel: i18n('joinTokenGatedRecoverToast.cancelLabel'),
                }
            )

            if (!ok) {
                return
            }

            yield toast.pop({
                title: i18n('joinTokenGatedRoomToast.checkingPermissionsTitle'),
                type: ToastType.Processing,
            })

            const streamrClient: StreamrClient = yield getTransactionalClient()

            yield* recover(
                function* () {
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
                },
                {
                    title: i18n('checkTokenGatedPermissionsRecoverToast.title'),
                    desc: i18n('checkTokenGatedPermissionsRecoverToast.desc'),
                    okLabel: i18n('checkTokenGatedPermissionsRecoverToast.okLabel'),
                    cancelLabel: i18n('checkTokenGatedPermissionsRecoverToast.cancelLabel'),
                }
            )

            yield put(PermissionsAction.invalidateAll({ roomId, address: requester }))

            yield put(PermissionsAction.invalidateAll({ roomId, address: delegatedAccount }))

            yield put(
                RoomAction.fetch({
                    roomId,
                    requester,
                })
            )

            yield toast.pop({
                title: i18n('joinTokenGatedRoomToast.successTitle'),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast.pop({
                title: i18n('joinTokenGatedRoomToast.failureTitle'),
                type: ToastType.Error,
            })
        } finally {
            if (!retoastConstroller) {
                // We don't wanna dismiss the outside toast. Let whoever created it clean it up.
                toast.discard({ asap: yield cancelled() })
            }
        }
    })
}
