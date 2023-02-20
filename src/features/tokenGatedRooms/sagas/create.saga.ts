// get relevant policyFactory
// deploy with given params
// assign permissions to the policy using the stream

import { takeEvery } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import { Contract, providers, BigNumber } from 'ethers'
import { Address } from '$/types'
import { TokenGatedRoomAction } from '..'
import { toast } from 'react-toastify'
import handleError from '$/utils/handleError'
import { error } from '$/utils/toaster'
import { RoomId } from '$/features/room/types'
import setMultiplePermissions from '$/utils/setMultiplePermissions'

import * as ERC20PolicyFactory from '$/contracts/Factories/ERC20PolicyFactory.sol/ERC20PolicyFactory.json'
import * as ERC721PolicyFactory from '$/contracts/Factories/ERC721PolicyFactory.sol/ERC721PolicyFactory.json'
import * as ERC777PolicyFactory from '$/contracts/Factories/ERC777PolicyFactory.sol/ERC777PolicyFactory.json'
import * as ERC1155PolicyFactory from '$/contracts/Factories/ERC1155PolicyFactory.sol/ERC1155PolicyFactory.json'

import { TokenTypes } from '$/features/tokenGatedRooms/types'
import {
    ERC1155PolicyFactoryAddress,
    ERC20PolicyFactoryAddress,
    ERC721PolicyFactoryAddress,
    ERC777PolicyFactoryAddress,
    PermissionType,
} from '$/features/tokenGatedRooms/utils/const'
import { getPolicyRegistry } from '$/features/tokenGatedRooms/utils/getPolicyRegistry'

function createInformationalToast(message: string, toastId?: string | number) {
    if (toastId) {
        toast.dismiss(toastId)
    }

    return toast.loading(message, {
        position: 'bottom-left',
        autoClose: false,
        type: 'info',
        closeOnClick: false,
        hideProgressBar: true,
    })
}

async function waitForPolicyToBeDeployed(
    registry: Contract,
    tokenAddress: Address,
    tokenId: BigNumber,
    roomId: RoomId,
    stakingEnabled: boolean
): Promise<Address> {
    const policyAddress: Address = await registry.getPolicy(
        tokenAddress,
        tokenId,
        roomId,
        stakingEnabled
    )

    if (policyAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(
            'policy at 0x0000000000000000000000000000000000000000 address, waiting 1 second and trying again'
        )
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return waitForPolicyToBeDeployed(registry, tokenAddress, tokenId, roomId, stakingEnabled)
    }

    return policyAddress
}

function* onCreate({
    payload: {
        owner,
        tokenAddress,
        tokenType,
        roomId,
        streamrClient,
        minRequiredBalance,
        tokenIds,
        stakingEnabled,
        provider,
    },
}: ReturnType<typeof TokenGatedRoomAction.create>) {
    let toastId
    try {
        toastId = createInformationalToast('Deploying Token Gate')

        let policyFactoryAbi: any
        let policyFactoryAddress: Address

        if (tokenType.standard !== TokenTypes.ERC20.standard) {
            throw new Error(`Unsupported token type: ${tokenType.standard}`)
        }

        switch (tokenType.standard) {
            case TokenTypes.ERC20.standard:
                policyFactoryAbi = ERC20PolicyFactory.abi
                policyFactoryAddress = ERC20PolicyFactoryAddress
                break
            case TokenTypes.ERC721.standard:
                policyFactoryAbi = ERC721PolicyFactory.abi
                policyFactoryAddress = ERC721PolicyFactoryAddress
                break
            case TokenTypes.ERC777.standard:
                policyFactoryAbi = ERC777PolicyFactory.abi
                policyFactoryAddress = ERC777PolicyFactoryAddress
                break
            case TokenTypes.ERC1155.standard:
                policyFactoryAbi = ERC1155PolicyFactory.abi
                policyFactoryAddress = ERC1155PolicyFactoryAddress
                break
            default:
                throw new Error(`Unsupported token type: ${tokenType.standard}`)
        }

        const factoryContract = new Contract(
            policyFactoryAddress,
            policyFactoryAbi,
            new providers.Web3Provider(provider).getSigner()
        )

        const tx: { [key: string]: any } = yield factoryContract.create(
            tokenAddress,
            roomId,
            minRequiredBalance,
            tokenIds,
            stakingEnabled,
            [PermissionType.Publish, PermissionType.Subscribe]
        )

        yield tx.wait(10)

        const policyAddress: Address = yield waitForPolicyToBeDeployed(
            getPolicyRegistry(provider),
            tokenAddress,
            BigNumber.from(tokenIds[0] || 0),
            roomId,
            stakingEnabled
        )

        toastId = createInformationalToast(
            `Assigning permissions to the Token Gate at ${policyAddress}`,
            toastId
        )

        yield setMultiplePermissions(
            roomId,
            [
                {
                    user: owner,
                    permissions: [StreamPermission.EDIT, StreamPermission.DELETE],
                },
                {
                    user: policyAddress,
                    permissions: [StreamPermission.GRANT],
                },
            ],
            {
                provider,
                requester: owner,
                streamrClient,
            }
        )

        toastId = createInformationalToast('Done!', toastId)
    } catch (e) {
        handleError(e)

        error('Failed to deploy Token Gate')
    } finally {
        if (toastId) {
            toast.dismiss(toastId)
        }
    }
}

export default function* create() {
    yield takeEvery(TokenGatedRoomAction.create, onCreate)
}
