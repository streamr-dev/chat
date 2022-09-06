import { put, takeEvery } from 'redux-saga/effects'
import { BigNumber, StreamPermission } from 'streamr-client'
import { Address } from '$/types'
import { TokenGatedRoomAction } from '..'
import { getJoinPolicyFactory } from '$/features/tokenGatedRooms/utils/getJoinPolicyFactory'

function* onRegisterERC20Policy({
    payload: { tokenAddress, stream, minTokenAmount, provider },
}: ReturnType<typeof TokenGatedRoomAction.registerERC20Policy>) {
    const factory = getJoinPolicyFactory(provider)
    yield factory.registerERC20Policy(tokenAddress, stream.id, BigNumber.from(minTokenAmount))
    const policyAddress: Address = yield factory.erc20TokensToJoinPolicies(tokenAddress)
    // assign permissions to the freshly-deployed policy contract
    yield stream.grantPermissions({
        user: policyAddress,
        permissions: [StreamPermission.GRANT],
    })

    // CURRENTLY DISABLED BECAUSE IT INTERFERED WEIRDLY WITH THE UI
    // give up one's own control over the stream
    /*
    await stream.revokePermissions({
        user: owner,
        permissions: [StreamPermission.GRANT]
    })
    console.info('revoked permissions from owner', owner)
    */
}

export default function* registerERC20Policy() {
    yield takeEvery(TokenGatedRoomAction.registerERC20Policy, onRegisterERC20Policy)
}
