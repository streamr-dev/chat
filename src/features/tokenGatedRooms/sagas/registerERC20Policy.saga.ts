import { takeEvery } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import { Contract, BigNumber } from 'ethers'
import { Address } from '$/types'
import { TokenGatedRoomAction } from '..'
import { getJoinPolicyFactory } from '$/features/tokenGatedRooms/utils/getJoinPolicyFactory'
import { toast } from 'react-toastify'
import handleError from '$/utils/handleError'
import { error } from '$/utils/toaster'
import { RoomId } from '$/features/room/types'
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
    factory: Contract,
    tokenAddress: Address,
    roomId: RoomId
): Promise<Address> {
    const policyAddress: Address = await factory.erc20TokensToJoinPolicies(tokenAddress, roomId)

    if (policyAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(
            'policy at 0x0000000000000000000000000000000000000000 address, waiting 1 second and trying again'
        )
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return waitForPolicyToBeDeployed(factory, tokenAddress, roomId)
    }

    return policyAddress
}
function* onRegisterERC20Policy({
    payload: { owner, tokenAddress, roomId, streamrClient, minTokenAmount, provider },
}: ReturnType<typeof TokenGatedRoomAction.registerERC20Policy>) {
    let toastId
    try {
        toastId = createInformationalToast('Deploying Token Gate')
        const factory = getJoinPolicyFactory(provider)
        const res: { [key: string]: any } = yield factory.registerERC20Policy(
            tokenAddress,
            roomId,
            BigNumber.from(minTokenAmount)
        )
        yield res.wait()

        const policyAddress: Address = yield waitForPolicyToBeDeployed(
            factory,
            tokenAddress,
            roomId
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

export default function* registerERC20Policy() {
    yield takeEvery(TokenGatedRoomAction.registerERC20Policy, onRegisterERC20Policy)
}
