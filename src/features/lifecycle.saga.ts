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
import search from '$/features/room/helpers/search'
import { ToasterAction } from '$/features/toaster'
import toast from '$/features/toaster/helpers/toast'
import fetchTokenMetadata from '$/features/misc/helpers/fetchTokenMetadata'
import { TokenMetadata } from '$/types'
import { WalletAction } from '$/features/wallet'
import changeAccount from '$/features/wallet/helpers/changeAccount'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { Wallet } from 'ethers'
import { put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { MiscAction } from '$/features/misc'
import { selectTokenMetadata } from '$/hooks/useTokenMetadata'
import fetchTokenStandard from '$/features/misc/helpers/fetchTokenStandard'

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

                const tokenMetadata: TokenMetadata = yield fetchTokenMetadata(payload)

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

        // This needs to go last. It triggers some of the actions that have
        // takers set up above.
        yield changeAccount(payload)
    })
}
