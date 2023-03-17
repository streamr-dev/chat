import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { selectWalletClient } from '$/features/wallet/selectors'
import { Address } from '$/types'
import delegationPreflight from '$/utils/delegationPreflight'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import handleError from '$/utils/handleError'
import { call, put, select } from 'redux-saga/effects'
import { BigNumber, Contract } from 'ethers'
import { abi as ERC20JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import { abi as ERC721JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import { abi as ERC777JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC777JoinPolicy.sol/ERC777JoinPolicy.json'
import { abi as ERC1155JoinPolicyAbi } from '$/contracts/JoinPolicies/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'
import { abi as ERC20TokenAbi } from '$/contracts/tokens/ERC20Token.sol/ERC20.json'
import { abi as ERC721TokenAbi } from '$/contracts/tokens/ERC721Token.sol/ERC721.json'
import Toast, { ToastType } from '$/components/Toast'
import StreamrClient, { Stream } from 'streamr-client'
import getRoomMetadata from '$/utils/getRoomMetadata'
import { ComponentProps } from 'react'
import { Controller } from '$/features/toaster/helpers/toast'
import retoast from '$/features/toaster/helpers/retoast'
import { Controller as ToastController } from '$/components/Toaster'
import { PermissionsAction } from '$/features/permissions'
import { RoomAction } from '$/features/room'
import waitForPermissions from '$/utils/waitForPermissions'
import isSameAddress from '$/utils/isSameAddress'
import tokenIdPreflight from '$/utils/tokenIdPreflight'
import recover from '$/utils/recover'
import i18n from '$/utils/i18n'
import getWalletProvider from '$/utils/getWalletProvider'
import { ZeroAddress } from '$/consts'

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

        const {
            name,
            tokenAddress,
            tokenType,
            stakingEnabled = false,
            minRequiredBalance,
        } = getRoomMetadata(stream)

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

            yield onToast({
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
                        if (stakingEnabled) {
                            yield onToast({
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
                            yield onToast({
                                title: i18n('joinTokenGatedRoomToast.authorizationComplete'),
                                type: ToastType.Success,
                            })
                        }
                        yield onToast({
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
                            yield onToast({
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

                        yield onToast({
                            title: i18n('joinTokenGatedRoomToast.requestComplete'),
                            type: ToastType.Success,
                        })

                        return true
                    } catch (e: any) {
                        if (
                            typeof e?.message === 'string' &&
                            /error_notEnoughTokens/.test(e.message)
                        ) {
                            yield onToast({
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

            yield onToast({
                title: i18n('joinTokenGatedRoomToast.checkingPermissionsTitle'),
                type: ToastType.Processing,
            })

            const streamrClient: StreamrClient | undefined = yield select(selectWalletClient)

            if (streamrClient) {
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
                        streamrClient,
                    })
                )
            }

            yield onToast({
                title: i18n('joinTokenGatedRoomToast.successTitle'),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield onToast({
                title: i18n('joinTokenGatedRoomToast.failureTitle'),
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
