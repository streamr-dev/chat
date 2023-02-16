import { takeEvery } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import { Contract, BigNumber } from 'ethers'
import { Address } from '$/types'
import { TokenGatedRoomAction } from '..'
import { getJoinPolicyFactory } from '$/features/tokenGatedRooms/utils/getJoinPolicyFactory'
import handleError from '$/utils/handleError'
import { RoomId } from '$/features/room/types'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { ToastType } from '$/components/Toast'
import retoast from '$/features/toaster/helpers/retoast'

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
    let tc: Controller | undefined

    let dismissToast = false

    try {
        tc = yield retoast(tc, {
            title: 'Deploying Token Gate…',
            type: ToastType.Processing,
        })

        dismissToast = true

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

        tc = yield retoast(tc, {
            title: `Assigning permissions to the Token Gate at ${policyAddress}…`,
        })

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

        dismissToast = false

        tc = yield retoast(tc, {
            title: 'Done!',
            type: ToastType.Success,
        })
    } catch (e) {
        handleError(e)

        dismissToast = false

        tc = yield retoast(tc, {
            title: 'Failed to deploy Token Gate',
            type: ToastType.Error,
        })
    } finally {
        if (dismissToast) {
            tc?.dismiss()
        }
    }
}

export default function* registerERC20Policy() {
    yield takeEvery(TokenGatedRoomAction.registerERC20Policy, onRegisterERC20Policy)
}
