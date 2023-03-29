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
import allowAnonsPublish from '$/features/permissions/helpers/allowAnonsPublish'
import { RoomAction } from '$/features/room'
import pinStickyRooms from '$/features/room/helpers/pinStickyRooms'
import searchRoom from '$/features/room/helpers/searchRoom'
import fetchTokenMetadata from '$/features/misc/helpers/fetchTokenMetadata'
import { TokenMetadata } from '$/types'
import { WalletAction } from '$/features/wallet'
import changeAccount from '$/features/wallet/helpers/changeAccount'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { Wallet } from 'ethers'
import { fork, put, select, takeEvery, takeLatest, takeLeading, throttle } from 'redux-saga/effects'
import { MiscAction } from '$/features/misc'
import { selectTokenMetadata } from '$/hooks/useTokenMetadata'
import fetchTokenStandard from '$/features/misc/helpers/fetchTokenStandard'
import preselectRoom from '$/features/room/helpers/preselectRoom'
import connectEagerly from '$/features/wallet/helpers/eagerConnect'
import connect from '$/features/wallet/helpers/connect'
import storeIntegrationId from '$/features/wallet/helpers/storeIntegrationId'
import setAccount from '$/features/wallet/helpers/setAccount'
import { DraftAction } from '$/features/drafts'
import storeDraft from '$/features/drafts/helpers/storeDraft'
import fetchEnsDomains from '$/features/ens/helpers/fetchEnsDomains'
import storeEnsDomains from '$/features/ens/helpers/storeEnsDomains'
import { IdenticonAction } from '$/features/identicons'
import retrieveIdenticon from '$/features/identicons/helpers/retrieveIdenticon'
import { MessageAction } from '$/features/message'
import publishMessage from '$/features/message/helpers/publishMessage'
import registerMessage from '$/features/message/helpers/registerMessage'
import updateMessageSeenAt from '$/features/message/helpers/updateMessageSeenAt.saga'
import resendMessages from '$/features/message/helpers/resendMessages'
import goto from '$/features/misc/helpers/goto'
import fetchKnownTokens from '$/features/misc/helpers/fetchKnownTokens'
import detectRoomMembers from '$/features/permissions/helpers/detectRoomMembers'
import addMember from '$/features/permissions/helpers/addMember'
import removeMember from '$/features/permissions/helpers/removeMember'
import acceptInvite from '$/features/permissions/helpers/acceptInvite'
import promoteDelegatedAccount from '$/features/permissions/helpers/promoteDelegatedAccount'
import { Stream } from 'streamr-client'
import fetchStream from '$/utils/fetchStream'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import joinRoom from '$/features/room/helpers/joinRoom'
import fetchPermission from '$/features/permissions/helpers/fetchPermission'
import fetchPermissions from '$/features/permissions/helpers/fetchPermissions'
import { PreferencesAction } from '$/features/preferences'
import setPreferences from '$/features/preferences/helpers/setPreferences'
import { RoomsAction } from '$/features/rooms'
import fetchRooms from '$/features/rooms/helpers/fetchRooms'
import createRoom from '$/features/room/helpers/createRoom'
import deleteLocalRoom from '$/features/room/helpers/deleteLocalRoom'
import deleteRoom from '$/features/room/helpers/deleteRoom'
import fetchRoom from '$/features/room/helpers/fetchRoom'
import getRoomPrivacy from '$/features/room/helpers/getRoomPrivacy'
import getStorageNodes from '$/features/room/helpers/getStorageNodes'
import registerRoomInvite from '$/features/room/helpers/registerRoomInvite'
import renameLocalRoom from '$/features/room/helpers/renameLocalRoom'
import renameRoom from '$/features/room/helpers/renameRoom'
import setRoomVisibility from '$/features/room/helpers/setRoomVisibility'
import syncRoom from '$/features/room/helpers/syncRoom'
import toggleStorageNode from '$/features/room/helpers/toggleStorageNode'
import unpinRoom from '$/features/room/helpers/unpinRoom'
import showHowItWorksModal from '$/features/misc/helpers/showHowItWorksModal'
import showWalletModal from '$/features/misc/helpers/showWalletModal'
import showAccountModal from '$/features/misc/helpers/showAccountModal'
import showAddMemberModal from '$/features/misc/helpers/showAddMemberModal'
import showRoomPropertiesModal from '$/features/misc/helpers/showRoomPropertiesModal'
import showAnonExplainerModal from '$/features/misc/helpers/showAnonExplainerModal'
import showAddRoomModal from '$/features/misc/helpers/showAddRoomModal'
import showEditMembersModal from '$/features/misc/helpers/showEditMembersModal'
import toast from '$/features/misc/helpers/toast'

function helper<T extends (arg: any) => any>(fn: T) {
    return function* ({ payload }: { payload: T extends (payload: infer R) => any ? R : never }) {
        yield fn(payload)
    }
}

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

        yield takeEveryUnique(DelegationAction.lookup, helper(lookup))

        yield takeEvery(RoomAction.select, function* ({ payload: roomId }) {
            if (!roomId) {
                return
            }

            yield put(AnonAction.setWallet({ roomId, wallet: Wallet.createRandom() }))
        })

        yield takeEvery(MiscAction.toast, helper(toast))

        yield takeEvery(AliasAction.set, helper(setAlias))

        yield takeEveryUnique(AvatarAction.retrieve, helper(retrieveAvatar))

        yield takeEvery(EnsAction.store, function* ({ payload }) {
            const ens = payload.record.content

            yield put(
                AvatarAction.retrieve({
                    ens,
                    fingerprint: Flag.isRetrievingAvatar(ens),
                })
            )
        })

        yield takeEveryUnique(RoomAction.pinSticky, helper(pinStickyRooms))

        yield takeEveryUnique(PermissionsAction.allowAnonsPublish, helper(allowAnonsPublish))

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

        yield takeEveryUnique(RoomAction.search, helper(searchRoom))

        yield takeEvery(RoomAction.preselect, function* ({ payload }) {
            yield put(RoomAction.cacheRecentRoomId(payload.roomId))
        })

        yield throttle(1000, DraftAction.store, function* ({ payload }) {
            yield storeDraft(payload)
        })

        yield takeEveryUnique(RoomAction.preselect, helper(preselectRoom))

        yield takeEvery(MessageAction.publish, helper(publishMessage))

        yield takeEvery(MessageAction.register, helper(registerMessage))

        yield takeEveryUnique(MessageAction.resend, helper(resendMessages))

        yield takeEveryUnique(MessageAction.updateSeenAt, helper(updateMessageSeenAt))

        yield takeEveryUnique(PermissionsAction.detectRoomMembers, helper(detectRoomMembers))

        yield takeEveryUnique(PermissionsAction.addMember, helper(addMember))

        yield takeEveryUnique(PermissionsAction.removeMember, helper(removeMember))

        yield takeEveryUnique(PermissionsAction.acceptInvite, helper(acceptInvite))

        yield takeEveryUnique(
            PermissionsAction.promoteDelegatedAccount,
            helper(promoteDelegatedAccount)
        )

        yield takeEveryUnique(PermissionsAction.join, function* ({ payload }) {
            const { requester, roomId } = payload

            try {
                const stream: Stream | null = yield fetchStream(roomId)

                if (!stream) {
                    throw new RoomNotFoundError(roomId)
                }

                yield joinRoom(stream, requester)
            } catch (e) {
                handleError(e)
            }
        })

        yield takeEveryUnique(PermissionsAction.fetchPermission, helper(fetchPermission))

        yield takeEveryUnique(PermissionsAction.fetchPermissions, helper(fetchPermissions))

        yield takeEvery(PreferencesAction.set, helper(setPreferences))

        yield takeLatest(RoomsAction.fetch, function* ({ payload }) {
            yield fetchRooms(payload.requester)
        })

        yield takeEvery(RoomAction.create, helper(createRoom))

        yield takeEvery(RoomAction.deleteLocal, helper(deleteLocalRoom))

        yield takeEveryUnique(RoomAction.delete, helper(deleteRoom))

        yield takeEvery(RoomAction.fetch, helper(fetchRoom))

        yield takeEveryUnique(RoomAction.getPrivacy, helper(getRoomPrivacy))

        yield takeEveryUnique(RoomAction.getStorageNodes, helper(getStorageNodes))

        yield takeEveryUnique(RoomAction.registerInvite, helper(registerRoomInvite))

        yield takeEvery(RoomAction.renameLocal, helper(renameLocalRoom))

        yield takeEveryUnique(RoomAction.rename, helper(renameRoom))

        yield takeEvery(RoomAction.setVisibility, helper(setRoomVisibility))

        yield takeEveryUnique(RoomAction.sync, helper(syncRoom))

        yield takeEveryUnique(RoomAction.toggleStorageNode, helper(toggleStorageNode))

        yield takeEveryUnique(RoomAction.unpin, helper(unpinRoom))

        yield takeEvery(MiscAction.showAddMemberModal, helper(showAddMemberModal))

        yield takeEvery(MiscAction.showRoomPropertiesModal, helper(showRoomPropertiesModal))

        yield takeEvery(MiscAction.showAnonExplainerModal, helper(showAnonExplainerModal))

        yield takeEvery(MiscAction.showAddRoomModal, helper(showAddRoomModal))

        yield takeEvery(MiscAction.showEditMembersModal, helper(showEditMembersModal))

        // This needs to go last. It triggers some of the actions that have
        // takers set up above.
        yield changeAccount(payload)
    })

    yield takeEvery(MiscAction.showHowItWorksModal, helper(showHowItWorksModal))

    yield takeEvery(MiscAction.showWalletModal, helper(showWalletModal))

    yield takeEvery(MiscAction.showAccountModal, helper(showAccountModal))

    yield takeLeading(WalletAction.connectEagerly, helper(connectEagerly))

    yield takeLatest(WalletAction.connect, helper(connect))

    yield takeEvery(WalletAction.setIntegrationId, function ({ payload }) {
        storeIntegrationId(payload)
    })

    yield takeEvery(EnsAction.fetchNames, helper(fetchEnsDomains))

    yield takeEveryUnique(EnsAction.store, function* ({ payload }) {
        yield storeEnsDomains(payload.record)
    })

    yield takeEveryUnique(IdenticonAction.retrieve, function* ({ payload }) {
        yield retrieveIdenticon(payload.seed)
    })

    yield takeEvery(MiscAction.goto, helper(goto))

    yield fork(fetchKnownTokens)

    yield fork(setAccount)
}
