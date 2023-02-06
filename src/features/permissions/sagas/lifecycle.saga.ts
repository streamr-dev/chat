import { PermissionsAction } from '$/features/permissions'
import acceptInvite from '$/features/permissions/sagas/helpers/acceptInvite'
import addMember from '$/features/permissions/sagas/helpers/addMember'
import detectRoomMembers from '$/features/permissions/sagas/helpers/detectRoomMembers'
import promoteDelegatedAccount from '$/features/permissions/sagas/helpers/promoteDelegatedAccount'
import removeMember from '$/features/permissions/sagas/helpers/removeMember'
import tokenGatedPromoteDelegatedAccount from '$/features/permissions/sagas/helpers/tokenGatedPromoteDelegatedAccount'
import { WalletAction } from '$/features/wallet'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { call, race, take } from 'redux-saga/effects'

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

                yield takeEveryUnique(
                    PermissionsAction.tokenGatedPromoteDelegatedAccount,
                    function* ({ payload }) {
                        yield tokenGatedPromoteDelegatedAccount(payload)
                    }
                )
            }),
        ])
    }
}
