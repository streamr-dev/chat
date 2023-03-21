import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { Address } from '$/types'
import delegationPreflight from '$/utils/delegationPreflight'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import handleError from '$/utils/handleError'
import { call, cancelled, put } from 'redux-saga/effects'
import { BigNumber, Contract } from 'ethers'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import Toast, { ToastType } from '$/components/Toast'
import StreamrClient, { Stream } from 'streamr-client'
import getRoomMetadata from '$/utils/getRoomMetadata'
import { Controller as ToastController } from '$/components/Toaster'
import { PermissionsAction } from '$/features/permissions'
import { RoomAction } from '$/features/room'
import waitForPermissions from '$/utils/waitForPermissions'
import isSameAddress from '$/utils/isSameAddress'
import tokenIdPreflight from '$/utils/tokenIdPreflight'
import recover from '$/utils/recover'
import i18n from '$/utils/i18n'
import getWalletProvider from '$/utils/getWalletProvider'
import getTransactionalClient from '$/utils/getTransactionalClient'
import retoast, { RetoastController } from '$/features/toaster/helpers/retoast'

const Abi = {
    [TokenStandard.ERC1155]: ERC1155JoinPolicyAbi,
    [TokenStandard.ERC20]: ERC20JoinPolicyAbi,
    [TokenStandard.ERC721]: ERC721JoinPolicyAbi,
    [TokenStandard.ERC777]: ERC777JoinPolicyAbi,
}

interface Options {
    retoastConstroller?: RetoastController
}

export default function join(
    stream: Stream,
    requester: Address,
    { retoastConstroller }: Options = {}
) {
    return call(function* () {
        const roomId = stream.id

        const { name, tokenAddress, tokenType, stakingEnabled = false } = getRoomMetadata(stream)

        const toast = retoastConstroller || retoast()

        let tokenIdTc: ToastController | undefined

        try {
            if (!tokenAddress) {
                yield toast.open({
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

            yield toast.open({
                title: i18n('joinTokenGatedRoomToast.joiningTitle', name, roomId),
                type: ToastType.Processing,
            })

            let tokenId = '0'

            if (tokenType.hasIds) {
                tokenId = yield* tokenIdPreflight(tokenStandard)
            }

            const delegatedAccount = yield* delegationPreflight(requester)

            const policyRegistry = getJoinPolicyRegistry(provider)

            const policyAddress: string = yield policyRegistry.getPolicy(
                tokenAddress,
                BigNumber.from(tokenId),
                roomId,
                stakingEnabled
            )

            const policy = new Contract(policyAddress, Abi[tokenStandard], policyRegistry.signer)

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
                            yield toast.open({
                                title: i18n('joinTokenGatedRoomToast.insufficientFundsTitle'),
                                type: ToastType.Error,
                                autoCloseAfter: 5,
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

            yield toast.open({
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

            yield toast.open({
                title: i18n('joinTokenGatedRoomToast.successTitle'),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast.open({
                title: i18n('joinTokenGatedRoomToast.failureTitle'),
                type: ToastType.Error,
            })
        } finally {
            tokenIdTc?.dismiss()

            if (!retoastConstroller) {
                // We don't wanna dismiss the outside toast. Let whoever created it clean it up.
                yield toast.dismiss({ asap: yield cancelled() })
            }
        }
    })
}
