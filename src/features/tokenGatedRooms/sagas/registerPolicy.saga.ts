import { retry, takeEvery } from 'redux-saga/effects'
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

    switch (tokenType.standard) {
        case TokenTypes.ERC20.standard:
            policyAddress = await factory.erc20TokensToJoinPolicies(tokenAddress, roomId)
            break
        case TokenTypes.ERC721.standard:
            policyAddress = await factory.erc721TokensToJoinPolicies(tokenAddress, tokenId, roomId)
            break
        default:
            throw new Error('Unknown token type')
    }

    if (policyAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Invalid policy address. Retry in a minute.')
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

        let res: Record<string, any>
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

        // await for 5 confirmations on the tx before starting retry prolicy
        yield res.wait(5)

        const policyAddress: Address = yield retry(
            5,
            5000,
            waitForPolicyToBeDeployed,
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
