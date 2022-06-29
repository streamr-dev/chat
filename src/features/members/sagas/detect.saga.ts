import { put } from 'redux-saga/effects'
import { PermissionAssignment } from 'streamr-client'
import { EnhancedStream } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import { MembersAction } from '..'
import { IMember } from '$/features/members/types'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { EnsAction } from '$/features/ens'

function* onDetectAction({
    payload: { roomId, streamrClient },
}: ReturnType<typeof MembersAction.detect>) {
    try {
        const members: IMember[] = []

        const stream: undefined | EnhancedStream = yield getStream(streamrClient, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const assignments: PermissionAssignment[] = yield stream.getPermissions()

        for (const assignment of assignments) {
            if (!('user' in assignment) || !assignment.user) {
                // Skip `PublicPermissionAssignment` items.
                continue
            }

            if (!assignment.permissions.length) {
                continue
            }

            members.push({
                address: assignment.user,
                permissions: assignment.permissions,
            })
        }

        yield put(MembersAction.set({ roomId, members }))

        yield put(EnsAction.fetchNames(members.map(({ address }) => address)))
    } catch (e) {
        handleError(e)
    }
}

export default function* detect() {
    yield takeEveryUnique(MembersAction.detect, onDetectAction)
}
