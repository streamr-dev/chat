import { takeEvery } from 'redux-saga/effects'
import { Contract, StreamPermission } from 'streamr-client'
import { BigNumber } from 'ethers'
import { Address } from '$/types'
import { TokenGatedRoomAction } from '..'
import { getJoinPolicyFactory } from '$/features/tokenGatedRooms/utils'
import { toast } from 'react-toastify'
import handleError from '$/utils/handleError'
import { error } from '$/utils/toaster'
import { RoomId } from '$/features/room/types'
import { HexSerializedBigNumber, TokenType, TokenTypes } from '$/features/tokenGatedRooms/types'
import setMultiplePermissions from '$/utils/setMultiplePermissions'

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
    tokenType: TokenType,
    factory: Contract,
    tokenAddress: Address,
    roomId: RoomId,
    tokenId?: HexSerializedBigNumber
): Promise<Address> {
    let policyAddress: Address
    if (tokenType.standard === TokenTypes.ERC20.standard) {
        policyAddress = await factory.erc20TokensToJoinPolicies(tokenAddress, roomId)
    } else if (tokenType.standard === TokenTypes.ERC721.standard) {
        policyAddress = await factory.erc721TokensToJoinPolicies(tokenAddress, tokenId, roomId)
    } else {
        throw new Error('Unknown token type')
    }

    if (policyAddress === '0x0000000000000000000000000000000000000000') {
        console.warn('policy at 0x00...000 address, waiting 5 second and trying again')
        await new Promise((resolve) => setTimeout(resolve, 5 * 1000))
        return waitForPolicyToBeDeployed(tokenType, factory, tokenAddress, roomId, tokenId)
    }

    return policyAddress
}

function* onRegisterPolicy({
    payload: {
        owner,
        tokenAddress,
        roomId,
        streamrClient,
        tokenType,
        minTokenAmount,
        tokenId,
        provider,
    },
}: ReturnType<typeof TokenGatedRoomAction.registerPolicy>) {
    let toastId
    try {
        const tokenStandard = tokenType.standard
        toastId = createInformationalToast('Deploying Token Gate')
        const factory = getJoinPolicyFactory(provider)

        let res: { [key: string]: any }
        switch (tokenStandard) {
            case TokenTypes.ERC20.standard:
                res = yield factory.registerERC20Policy(
                    tokenAddress,
                    roomId,
                    BigNumber.from(minTokenAmount)
                )
                break
            case TokenTypes.ERC721.standard:
                res = yield factory.registerERC721Policy(tokenAddress, tokenId, roomId)
                break
            default:
                throw new Error('Unknown token type')
        }

        yield res.wait()

        const policyAddress: Address = yield waitForPolicyToBeDeployed(
            tokenType,
            factory,
            tokenAddress,

            roomId,
            tokenId
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

export default function* registerPolicy() {
    yield takeEvery(TokenGatedRoomAction.registerPolicy, onRegisterPolicy)
}
