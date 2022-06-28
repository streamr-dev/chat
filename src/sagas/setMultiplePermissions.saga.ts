import { Flag } from '$/features/flag/types'
import { MembersAction } from '$/features/members'
import { PermissionAction } from '$/features/permission'
import { RoomId } from '$/features/room/types'
import { Address } from '$/types'
import preflight from '$/utils/preflight'
import { Provider } from '@web3-react/types'
import { put } from 'redux-saga/effects'
import StreamrClient, { UserPermissionAssignment } from 'streamr-client'

interface Options {
    provider: Provider
    requester: Address
    streamrClient: StreamrClient
}

export default function* setMultiplePermissions(
    roomId: RoomId,
    assignments: UserPermissionAssignment[],
    { provider, requester, streamrClient }: Options
) {
    yield preflight({
        provider,
        requester,
    })

    yield streamrClient.setPermissions({
        streamId: roomId,
        assignments,
    })

    yield put(
        MembersAction.detect({
            roomId,
            streamrClient,
            fingerprint: Flag.isDetectingMembers(roomId),
        })
    )

    for (let i = 0; i < assignments.length; i++) {
        yield put(PermissionAction.invalidateAll({ roomId, address: assignments[i].user }))
    }
}
