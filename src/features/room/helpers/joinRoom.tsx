import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { Address } from '$/types'
import delegationPreflight from '$/utils/delegationPreflight'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import handleError from '$/utils/handleError'
import { call, cancelled, put } from 'redux-saga/effects'
import { BigNumber, Contract, providers } from 'ethers'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import { abi as ERC20TokenAbi } from '$/contracts/tokens/ERC20Token.sol/ERC20.json'
import { abi as ERC721TokenAbi } from '$/contracts/tokens/ERC721Token.sol/ERC721.json'
import { ToastType } from '$/components/Toast'
import StreamrClient, { Stream } from 'streamr-client'
import getRoomMetadata from '$/utils/getRoomMetadata'
import { PermissionsAction } from '$/features/permissions'
import { RoomAction } from '$/features/room'
import waitForPermissions from '$/utils/waitForPermissions'
import isSameAddress from '$/utils/isSameAddress'
import tokenIdPreflight from '$/utils/tokenIdPreflight'
import recover from '$/utils/recover'
import i18n from '$/utils/i18n'
import getWalletProvider from '$/utils/getWalletProvider'
import { ZeroAddress } from '$/consts'
import getTransactionalClient from '$/utils/getTransactionalClient'
import retoast, { RetoastController } from '$/features/misc/helpers/retoast'
import getSigner from '$/utils/getSigner'
import { JSON_RPC_URL } from '$/consts'

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
        const toast = retoastConstroller || retoast()

        const {
            name,
            tokenAddress,
            tokenType,
            stakingEnabled = false,
            minRequiredBalance,
        } = getRoomMetadata(stream)

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

            const policyRegistry = getJoinPolicyRegistry(
                new providers.JsonRpcProvider(JSON_RPC_URL)
            )

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
                        if (stakingEnabled) {
                            yield toast.pop({
                                title: i18n('joinTokenGatedRoomToast.authorizeTokenTransfer'),
                                type: ToastType.Processing,
                            })
                            let authorizationTx: Record<string, any>
                            let tokenContract: Contract
                            switch (tokenStandard) {
                                case TokenStandard.ERC20:
                                    tokenContract = new Contract(
                                        tokenAddress,
                                        ERC20TokenAbi,
                                        policyRegistry.signer
                                    )
                                    authorizationTx = yield tokenContract.approve(
                                        policyAddress,
                                        BigNumber.from(minRequiredBalance || 0)
                                    )
                                    break
                                case TokenStandard.ERC721:
                                    tokenContract = new Contract(
                                        tokenAddress,
                                        ERC721TokenAbi,
                                        policyRegistry.signer
                                    )
                                    authorizationTx = yield tokenContract.approve(
                                        policyAddress,
                                        BigNumber.from(tokenId)
                                    )
                                    break
                                default:
                                    throw new Error(`Unsupported token standard ${tokenStandard}`)
                            }

                            yield authorizationTx.wait()
                            yield toast.pop({
                                title: i18n('joinTokenGatedRoomToast.authorizationComplete'),
                                type: ToastType.Success,
                            })
                        }
                        yield toast.pop({
                            title: i18n('joinTokenGatedRoomToast.requestingJoin'),
                            type: ToastType.Processing,
                        })
                        let tx: Record<string, any>
                        if (tokenType.hasIds) {
                            tx = yield policy.requestDelegatedJoin(BigNumber.from(tokenId))
                        } else {
                            tx = yield policy.requestDelegatedJoin()
                        }
                        yield tx.wait()

                        // revoke the token allowance for the tokenGate
                        if (stakingEnabled) {
                            yield toast.pop({
                                title: i18n('joinTokenGatedRoomToast.revokeTokenTransfer'),
                                type: ToastType.Processing,
                            })
                            let authorizationTx: Record<string, any>
                            let tokenContract: Contract
                            switch (tokenType.standard) {
                                case TokenStandard.ERC20:
                                    tokenContract = new Contract(
                                        tokenAddress,
                                        ERC20TokenAbi,
                                        policyRegistry.signer
                                    )
                                    authorizationTx = yield tokenContract.approve(
                                        policyAddress,
                                        BigNumber.from(0)
                                    )
                                    break
                                case TokenStandard.ERC721:
                                    tokenContract = new Contract(
                                        tokenAddress,
                                        ERC721TokenAbi,
                                        policyRegistry.signer
                                    )
                                    authorizationTx = yield tokenContract.approve(
                                        ZeroAddress,
                                        BigNumber.from(tokenId)
                                    )
                                    break
                                default:
                                    throw new Error(
                                        `Unsupported token standard ${tokenType.standard}`
                                    )
                            }

                            yield authorizationTx.wait()
                        }

                        yield toast.pop({
                            title: i18n('joinTokenGatedRoomToast.requestComplete'),
                            type: ToastType.Success,
                        })

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
