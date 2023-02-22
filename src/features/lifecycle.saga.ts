import { AliasAction } from '$/features/alias'
import setAlias from '$/features/alias/helpers/setAlias'
import { AnonAction } from '$/features/anon'
import { AvatarAction } from '$/features/avatar'
import retrieveAvatar from '$/features/avatar/helpers/retrieveAvatar'
import { DelegationAction } from '$/features/delegation'
import lookup from '$/features/delegation/helpers/lookup'
import retrieve from '$/features/delegation/helpers/retrieve'
import { EnsAction } from '$/features/ens'
import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import allowAnonsPublish from '$/features/permissions/sagas/helpers/allowAnonsPublish'
import { RoomAction } from '$/features/room'
import pin from '$/features/room/helpers/pin'
import pinSticky from '$/features/room/helpers/pinSticky'
import { ToasterAction } from '$/features/toaster'
import toast from '$/features/toaster/helpers/toast'
import { WalletAction } from '$/features/wallet'
import changeAccount from '$/features/wallet/helpers/changeAccount'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { Wallet } from 'ethers'
import { put, takeEvery, takeLatest } from 'redux-saga/effects'

export default function* lifecycle() {
    yield takeLatest(WalletAction.changeAccount, function* ({ payload }) {
        yield takeEveryUnique(DelegationAction.requestPrivateKey, function* ({ payload }) {
            try {
                // `retrieve` returns the retrieved account address thus can also
                // throw exceptions. Let's log them and carry on.
                yield retrieve(payload)
            } catch (e) {
                handleError(e)
            }
        })

        yield takeEveryUnique(DelegationAction.lookup, function* ({ payload }) {
            yield lookup(payload)
        })

        yield takeLatest(RoomAction.pin, function* ({ payload }) {
            yield pin(payload)
        })

        yield takeEvery(RoomAction.select, function* ({ payload: roomId }) {
            if (!roomId) {
                return
            }

            yield put(AnonAction.setWallet({ roomId, wallet: Wallet.createRandom() }))
        })

        yield takeEvery(ToasterAction.show, function* ({ payload }) {
            yield toast(payload)
        })

        yield takeEvery(AliasAction.set, function* ({ payload }) {
            yield setAlias(payload)
        })

        yield takeEveryUnique(AvatarAction.retrieve, function* ({ payload }) {
            yield retrieveAvatar(payload)
        })

        yield takeEvery(EnsAction.store, function* ({ payload }) {
            const ens = payload.record.content

            yield put(
                AvatarAction.retrieve({
                    ens,
                    fingerprint: Flag.isRetrievingAvatar(ens),
                })
            )
        })

        yield takeEveryUnique(RoomAction.pinSticky, function* ({ payload }) {
            yield pinSticky(payload)
        })

        yield takeEveryUnique(PermissionsAction.allowAnonsPublish, function* ({ payload }) {
            yield allowAnonsPublish(payload)
        })

        // This needs to go last. It triggers some of the actions that have
        // takers set up above.
        yield changeAccount(payload)
    })
}
