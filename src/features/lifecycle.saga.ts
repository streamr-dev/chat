import { AnonAction } from '$/features/anon'
import { DelegationAction } from '$/features/delegation'
import lookup from '$/features/delegation/helpers/lookup'
import retrieve from '$/features/delegation/helpers/retrieve'
import { RoomAction } from '$/features/room'
import pin from '$/features/room/helpers/pin'
import { ToasterAction } from '$/features/toaster'
import toast from '$/features/toaster/helpers/toast'
import { WalletAction } from '$/features/wallet'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { Wallet } from 'ethers'
import { call, put, race, take, takeEvery, takeLatest } from 'redux-saga/effects'

export default function* lifecycle() {
    while (true) {
        yield race([
            take(WalletAction.changeAccount),
            call(function* () {
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
            }),
        ])
    }
}
