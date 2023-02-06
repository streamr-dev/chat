import { PermissionsAction } from '$/features/permissions'
import detectRoomMembers from '$/features/permissions/sagas/helpers/detectRoomMembers'
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
            }),
        ])
    }
}
