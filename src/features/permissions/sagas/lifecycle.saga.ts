import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import acceptInvite from '$/features/permissions/sagas/helpers/acceptInvite'
import addMember from '$/features/permissions/sagas/helpers/addMember'
import detectRoomMembers from '$/features/permissions/sagas/helpers/detectRoomMembers'
import fetchPermission from '$/features/permissions/sagas/helpers/fetchPermission'
import fetchPermissions from '$/features/permissions/sagas/helpers/fetchPermissions'
import promoteDelegatedAccount from '$/features/permissions/sagas/helpers/promoteDelegatedAccount'
import removeMember from '$/features/permissions/sagas/helpers/removeMember'
import join from '$/features/room/helpers/join'
import { WalletAction } from '$/features/wallet'
import fetchStream from '$/utils/fetchStream'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { call, race, take } from 'redux-saga/effects'
import { Stream } from 'streamr-client'

export default function* lifecycle() {
    while (true) {
        yield race([
            take(WalletAction.changeAccount),
            call(function* () {
                yield takeEveryUnique(PermissionsAction.detectRoomMembers, function* ({ payload }) {
                    yield detectRoomMembers(payload)
                })

                yield takeEveryUnique(PermissionsAction.addMember, function* ({ payload }) {
                    yield addMember(payload)
                })

                yield takeEveryUnique(PermissionsAction.removeMember, function* ({ payload }) {
                    yield removeMember(payload)
                })

                yield takeEveryUnique(PermissionsAction.acceptInvite, function* ({ payload }) {
                    yield acceptInvite(payload)
                })

                yield takeEveryUnique(
                    PermissionsAction.promoteDelegatedAccount,
                    function* ({ payload }) {
                        yield promoteDelegatedAccount(payload)
                    }
                )

                yield takeEveryUnique(PermissionsAction.join, function* ({ payload }) {
                    const { requester, roomId } = payload

                    try {
                        const stream: Stream | null = yield fetchStream(roomId)

                        if (!stream) {
                            throw new RoomNotFoundError(roomId)
                        }

                        yield join(stream, requester)
                    } catch (e) {
                        handleError(e)
                    }
                })

                yield takeEveryUnique(PermissionsAction.fetchPermission, function* ({ payload }) {
                    yield fetchPermission(payload)
                })

                yield takeEveryUnique(PermissionsAction.fetchPermissions, function* ({ payload }) {
                    yield fetchPermissions(payload)
                })
            }),
        ])
    }
}
