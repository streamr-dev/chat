import { MembersAction } from '$/features/members'
import { PermissionAction } from '$/features/permission'
import { RoomId } from '$/features/room/types'
import getWalletAccount from '$/sagas/getWalletAccount.saga'
import getWalletClient from '$/sagas/getWalletClient.saga'
import getWalletProvider from '$/sagas/getWalletProvider.saga'
import { Address } from '$/types'
import preflight from '$/utils/preflight'
import { Provider } from '@web3-react/types'
import { call, put } from 'redux-saga/effects'
import StreamrClient, { UserPermissionAssignment } from 'streamr-client'

export default function* setMultiplePermissions(
    roomId: RoomId,
    assignments: UserPermissionAssignment[]
) {
    const provider: Provider = yield call(getWalletProvider)

    const requester: Address = yield call(getWalletAccount)

    yield preflight({
        provider,
        address: requester,
    })

    const client: StreamrClient = yield call(getWalletClient)

    yield client.setPermissions({
        streamId: roomId,
        assignments,
    })

    yield put(MembersAction.detect(roomId))

    for (let i = 0; i < assignments.length; i++) {
        yield put(PermissionAction.invalidateAll({ roomId, address: assignments[i].user }))
    }
}
