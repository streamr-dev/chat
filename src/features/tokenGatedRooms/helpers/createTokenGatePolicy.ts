import { ToastType } from '$/components/Toast'
import { RoomId } from '$/features/room/types'
import retoast from '$/features/toaster/helpers/retoast'
import { TokenStandard, TokenType } from '$/features/tokenGatedRooms/types'
import { WalletAction } from '$/features/wallet'
import { Address } from '$/types'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { Provider } from '@web3-react/types'
import { Contract, providers, BigNumber } from 'ethers'
import { call, race, retry, spawn, take } from 'redux-saga/effects'
import StreamrClient, { StreamPermission } from 'streamr-client'
import { abi as erc20abi } from '$/contracts/Factories/ERC20PolicyFactory.sol/ERC20PolicyFactory.json'
import { abi as erc721abi } from '$/contracts/Factories/ERC721PolicyFactory.sol/ERC721PolicyFactory.json'
import { abi as erc777abi } from '$/contracts/Factories/ERC777PolicyFactory.sol/ERC777PolicyFactory.json'
import { abi as erc1155abi } from '$/contracts/Factories/ERC1155PolicyFactory.sol/ERC1155PolicyFactory.json'
import {
    ERC1155PolicyFactoryAddress,
    ERC20PolicyFactoryAddress,
    ERC721PolicyFactoryAddress,
    ERC777PolicyFactoryAddress,
    PermissionType,
} from '$/consts'
import getJoinPolicyRegistry from '$/utils/getJoinPolicyRegistry'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { ZeroAddress } from '$/consts'
import { Controller } from '$/features/toaster/helpers/toast'
import isSameAddress from '$/utils/isSameAddress'

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
    provider: Provider
    streamrClient: StreamrClient
}

export default function createTokenGatePolicy({
    owner: requester,
    tokenAddress,
    tokenType,
    roomId,
    minRequiredBalance,
    tokenIds,
    stakingEnabled,
    provider,
    streamrClient,
}: Params) {
    return spawn(function* () {
        yield race([
            take(WalletAction.changeAccount),
            call(function* () {
                let tc: Controller | undefined

                let dismissToast = false

                try {
                    tc = yield retoast(tc, {
                        title: 'Deploying token gate…',
                        type: ToastType.Processing,
                    })

                    dismissToast = true

                    yield preflight({
                        provider,
                        requester,
                    })

                    const factory = Factory[tokenType.standard]

                    if (!factory) {
                        throw new Error(`Unsupported standard: ${tokenType.standard}`)
                    }

                    const { abi, address } = factory

                    const factoryContract = new Contract(
                        address,
                        abi,
                        new providers.Web3Provider(provider).getSigner()
                    )

                    const tx: Record<string, any> = yield factoryContract.create(
                        tokenAddress,
                        roomId,
                        BigNumber.from(minRequiredBalance || 0),
                        tokenIds.map((id) => BigNumber.from(id)),
                        stakingEnabled,
                        [PermissionType.Publish, PermissionType.Subscribe]
                    )

                    yield tx.wait(10)

                    const policyRegistry = getJoinPolicyRegistry(provider)

                    let policyAddress: Address = ZeroAddress

                    tc = yield retoast(tc, {
                        title: 'Waiting for the network…',
                        type: ToastType.Processing,
                    })

                    dismissToast = true

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

                    tc = yield retoast(tc, {
                        title: `Assigning permissions to the token gate at ${policyAddress}`,
                        type: ToastType.Processing,
                    })

                    dismissToast = true

                    yield setMultiplePermissions(
                        roomId,
                        [
                            {
                                user: requester,
                                permissions: [StreamPermission.EDIT, StreamPermission.DELETE],
                            },
                            {
                                user: policyAddress,
                                permissions: [StreamPermission.GRANT],
                            },
                        ],
                        {
                            provider,
                            requester,
                            streamrClient,
                        }
                    )

                    tc = yield retoast(tc, {
                        title: 'Done!',
                        type: ToastType.Success,
                    })

                    dismissToast = false
                } catch (e) {
                    handleError(e)

                    tc = yield retoast(tc, {
                        title: 'Failed to deploy your token gate',
                        type: ToastType.Error,
                    })

                    dismissToast = false
                } finally {
                    if (dismissToast) {
                        tc?.dismiss()
                    }
                }
            }),
        ])
    })
}