import { ToastType } from '$/components/Toast'
import {
    ERC1155PolicyFactoryAddress,
    ERC20PolicyFactoryAddress,
    ERC721PolicyFactoryAddress,
    ERC777PolicyFactoryAddress,
    PermissionType,
    ZeroAddress,
} from '$/consts'
import { abi as erc1155abi } from '$/contracts/Factories/ERC1155PolicyFactory.sol/ERC1155PolicyFactory.json'
import { abi as erc20abi } from '$/contracts/Factories/ERC20PolicyFactory.sol/ERC20PolicyFactory.json'
import { abi as erc721abi } from '$/contracts/Factories/ERC721PolicyFactory.sol/ERC721PolicyFactory.json'
import { abi as erc777abi } from '$/contracts/Factories/ERC777PolicyFactory.sol/ERC777PolicyFactory.json'
import retoast from '$/features/misc/helpers/retoast'
import { RoomId } from '$/features/room/types'
import { TokenStandard, TokenType } from '$/features/tokenGatedRooms/types'
import { WalletAction } from '$/features/wallet'
import { Address } from '$/types'
import { getJsonRpcProvider } from '$/utils'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import getSigner from '$/utils/getSigner'
import getWalletProvider from '$/utils/getWalletProvider'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import isSameAddress from '$/utils/isSameAddress'
import preflight from '$/utils/preflight'
import recover from '$/utils/recover'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { StreamPermission } from '@streamr/sdk'
import { BigNumber, Contract } from 'ethers'
import { call, cancelled, race, retry, spawn, take } from 'redux-saga/effects'

const Factory: Record<
    TokenStandard,
    {
        abi: typeof erc20abi | typeof erc1155abi | typeof erc721abi | typeof erc777abi
        address: Address
    } | null
> = {
    [TokenStandard.ERC1155]: {
        abi: erc1155abi,
        address: ERC1155PolicyFactoryAddress,
    },
    [TokenStandard.ERC20]: {
        abi: erc20abi,
        address: ERC20PolicyFactoryAddress,
    },
    [TokenStandard.ERC721]: {
        abi: erc721abi,
        address: ERC721PolicyFactoryAddress,
    },
    [TokenStandard.ERC777]: {
        abi: erc777abi,
        address: ERC777PolicyFactoryAddress,
    },
    [TokenStandard.Unknown]: null,
}

interface Params {
    owner: Address
    tokenAddress: Address
    tokenType: TokenType
    roomId: RoomId
    minRequiredBalance?: string
    tokenIds: string[]
    stakingEnabled: boolean
}

export default function createTokenGatePolicy({
    owner: requester,
    tokenAddress,
    tokenType,
    roomId,
    minRequiredBalance,
    tokenIds,
    stakingEnabled,
}: Params) {
    return spawn(function* () {
        yield race([
            take(WalletAction.changeAccount),
            call(function* () {
                const toast = retoast()

                try {
                    yield toast.pop({
                        title: i18n('tokenGateToast.deployingTitle'),
                        type: ToastType.Processing,
                    })

                    const factory = Factory[tokenType.standard]

                    if (!factory) {
                        throw new Error(`Unsupported standard: ${tokenType.standard}`)
                    }

                    const { abi, address } = factory

                    yield preflight(requester)

                    const provider = yield* getWalletProvider()

                    const factoryContract = new Contract(address, abi, getSigner(provider))

                    yield* recover(
                        function* () {
                            const tx: Record<string, any> = yield factoryContract.create(
                                tokenAddress,
                                roomId,
                                BigNumber.from(minRequiredBalance || 0),
                                tokenIds.map((id) => BigNumber.from(id)),
                                stakingEnabled,
                                [PermissionType.Publish, PermissionType.Subscribe]
                            )

                            yield tx.wait(10)
                        },
                        {
                            title: i18n('tokenGatePolicyRecoverToast.title'),
                            desc: i18n('tokenGatePolicyRecoverToast.desc'),
                            okLabel: i18n('tokenGatePolicyRecoverToast.okLabel'),
                            cancelLabel: i18n('tokenGatePolicyRecoverToast.cancelLabel'),
                        }
                    )

                    const policyRegistry = getJoinPolicyRegistry(getJsonRpcProvider())

                    let policyAddress: Address = ZeroAddress

                    yield toast.pop({
                        title: i18n('tokenGateToast.waitingTitle'),
                        type: ToastType.Processing,
                    })

                    yield* recover(
                        function* () {
                            yield retry(30, 1000, async function () {
                                policyAddress = await policyRegistry.getPolicy(
                                    tokenAddress,
                                    tokenIds[0] || 0,
                                    roomId,
                                    stakingEnabled
                                )

                                if (isSameAddress(policyAddress, ZeroAddress)) {
                                    throw new Error('Invalid policy address')
                                }
                            })
                        },
                        {
                            title: i18n('tokenGateAddressRecoverToast.title'),
                            desc: i18n('tokenGateAddressRecoverToast.desc'),
                            okLabel: i18n('tokenGateAddressRecoverToast.okLabel'),
                            cancelLabel: i18n('tokenGateAddressRecoverToast.cancelLabel'),
                        }
                    )

                    yield toast.pop({
                        title: i18n('tokenGateToast.grantingTitle', policyAddress),
                        type: ToastType.Processing,
                    })

                    yield* recover(
                        function* () {
                            yield setMultiplePermissions(
                                roomId,
                                [
                                    {
                                        userId: requester,
                                        permissions: [
                                            StreamPermission.EDIT,
                                            StreamPermission.DELETE,
                                        ],
                                    },
                                    {
                                        userId: policyAddress,
                                        permissions: [StreamPermission.GRANT],
                                    },
                                ],
                                {
                                    requester,
                                }
                            )
                        },
                        {
                            title: i18n('tokenGateGrantRecoverToast.title'),
                            desc: i18n('tokenGateGrantRecoverToast.desc'),
                            okLabel: i18n('tokenGateGrantRecoverToast.okLabel'),
                            cancelLabel: i18n('tokenGateGrantRecoverToast.cancelLabel'),
                        }
                    )

                    yield toast.pop({
                        title: i18n('tokenGateToast.successTitle'),
                        type: ToastType.Success,
                    })
                } catch (e) {
                    handleError(e)

                    yield toast.pop({
                        title: i18n('tokenGateToast.failureTitle'),
                        type: ToastType.Error,
                    })
                } finally {
                    toast.discard({ asap: yield cancelled() })
                }
            }),
        ])
    })
}
