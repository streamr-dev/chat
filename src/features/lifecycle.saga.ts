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
import pinSticky from '$/features/room/helpers/pinSticky'
import search from '$/features/room/helpers/search'
import { ToasterAction } from '$/features/toaster'
import fetchTokenMetadata from '$/features/misc/helpers/fetchTokenMetadata'
import { TokenMetadata } from '$/types'
import { WalletAction } from '$/features/wallet'
import changeAccount from '$/features/wallet/helpers/changeAccount'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { Wallet } from 'ethers'
import { fork, put, select, spawn, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { MiscAction } from '$/features/misc'
import { selectTokenMetadata } from '$/hooks/useTokenMetadata'
import fetchTokenStandard from '$/features/misc/helpers/fetchTokenStandard'
import preselect from '$/features/room/helpers/preselect'
import connectEagerly from '$/features/wallet/helpers/eagerConnect'
import connect from '$/features/wallet/helpers/connect'
import storeIntegrationId from '$/features/wallet/helpers/storeIntegrationId'
import setAccount from '$/features/wallet/helpers/setAccount'
import { Controller } from '$/components/Toaster'
import toaster from '$/features/toaster/helpers/toaster'
import Toast from '$/components/Toast'

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

        yield takeEvery(RoomAction.select, function* ({ payload: roomId }) {
            if (!roomId) {
                return
            }

            yield put(AnonAction.setWallet({ roomId, wallet: Wallet.createRandom() }))
        })

        yield takeEvery(ToasterAction.show, function* ({ payload }) {
            yield spawn(function* () {
                try {
                    const tc: Controller = yield toaster(Toast, payload)

                    yield tc.open()
                } catch (e) {
                    handleError(e)
                }
            })
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

        yield takeEveryUnique(MiscAction.fetchTokenStandard, function* ({ payload }) {
            yield fetchTokenStandard(payload)
        })

        yield takeEveryUnique(MiscAction.fetchTokenMetadata, function* ({ payload }) {
            try {
                const cachedTokenMetadata: TokenMetadata | undefined = yield select(
                    selectTokenMetadata(payload.tokenAddress, payload.tokenIds)
                )

                if (cachedTokenMetadata) {
                    return
                }

                const tokenMetadata = yield* fetchTokenMetadata(payload)

                yield put(
                    MiscAction.cacheTokenMetadata({
                        tokenAddress: payload.tokenAddress,
                        tokenIds: payload.tokenIds,
                        tokenMetadata,
                    })
                )
            } catch (e) {
                handleError(e)
            }
        })

        yield takeEveryUnique(RoomAction.search, function* ({ payload }) {
            yield search(payload)
        })

        yield takeEvery(RoomAction.preselect, function* ({ payload }) {
            yield put(RoomAction.cacheRecentRoomId(payload.roomId))
        })

        yield takeEveryUnique(RoomAction.preselect, function* ({ payload }) {
            yield preselect(payload)
        })

        // This needs to go last. It triggers some of the actions that have
        // takers set up above.
        yield changeAccount(payload)
    })

    yield takeLeading(WalletAction.connectEagerly, function* () {
        yield connectEagerly()
    })

    yield takeLatest(WalletAction.connect, function* ({ payload }) {
        yield connect(payload)
    })

    yield takeEvery(WalletAction.setIntegrationId, function ({ payload }) {
        storeIntegrationId(payload)
    })

    yield fork(setAccount)
}
