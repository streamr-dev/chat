import { ToastType } from '$/components/Toast'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { MiscAction } from '$/features/misc'
import { PreferencesAction } from '$/features/preferences'
import { IPreference } from '$/features/preferences/types'
import { RoomAction } from '$/features/room'
import join from '$/features/room/helpers/join'
import { IRoom, RoomId } from '$/features/room/types'
import retoast from '$/features/toaster/helpers/retoast'
import { Address, State } from '$/types'
import db from '$/utils/db'
import fetchStream from '$/utils/fetchStream'
import getRoomMetadata from '$/utils/getRoomMetadata'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import i18n from '$/utils/i18n'
import { call, cancelled, put, select } from 'redux-saga/effects'
import { Stream } from 'streamr-client'

function selectRecentRoomId({ room }: State) {
    return room.recentRoomId
}

function selectRoom(roomId: RoomId, owner: Address) {
    return call(function* () {
        const recentRoomId: RoomId | undefined = yield select(selectRecentRoomId)

        if (recentRoomId !== roomId) {
            // The user navigated away. Don't select.
            return
        }

        yield put(RoomAction.select(roomId))

        yield put(
            PreferencesAction.set({
                owner,
                selectedRoomId: roomId,
            })
        )
    })
}

export default function preselect({
    roomId,
    account,
}: ReturnType<typeof RoomAction.preselect>['payload']) {
    return call(function* () {
        if (!account) {
            // No account means that either someone locked their wallet or we're in the middle of
            // a switch. Either way, deselect and wait for another `preselect` call.
            yield put(RoomAction.select(undefined))

            return
        }

        const owner = account.toLowerCase()

        const toast = retoast()

        try {
            yield call(function* open() {
                let preferences: null | IPreference = null

                try {
                    preferences = yield db.preferences.where('owner').equals(owner).first()
                } catch (e) {
                    // Ignore.
                }

                if (!roomId) {
                    // No room id? Let's see what room was selected last time the current account
                    // visited the site and go there.
                    if (preferences?.selectedRoomId) {
                        yield put(MiscAction.goto(preferences?.selectedRoomId))
                    }

                    return
                }

                let selectedRoom: null | IRoom = null

                try {
                    selectedRoom = yield db.rooms
                        .where({
                            owner,
                            id: roomId,
                        })
                        .first()
                } catch (e) {
                    yield toast.open({
                        type: ToastType.Error,
                        title: i18n('preselectToast.roomNotFoundTitle'),
                    })

                    return
                }

                const localName = selectedRoom?.name

                yield toast.open({
                    title: i18n('preselectToast.openingTitle', localName, roomId),
                    type: ToastType.Processing,
                })

                if (selectedRoom) {
                    if (selectedRoom.hidden && !preferences?.showHiddenRooms) {
                        // Room is known but it's been hidden. Let's change that.
                        try {
                            yield db.rooms.where({ owner, id: roomId }).modify({
                                hidden: false,
                            })
                        } catch (e) {
                            yield toast.open({
                                type: ToastType.Error,
                                title: i18n('preselectToast.failedToUnhideTitle'),
                            })
                        }
                    }

                    // At this point the room is known and unhidden.
                    yield selectRoom(roomId, owner)

                    return
                }

                /**
                 * The requested room isn't on the list of rooms the app knows. In the next steps
                 * we're gonna make efforts to pin/bookmark it.
                 */

                const stream: Stream | null = yield fetchStream(roomId)

                if (!stream) {
                    throw new RoomNotFoundError(roomId)
                }

                const { createdAt, createdBy, tokenAddress, name = '' } = getRoomMetadata(stream)

                yield toast.open({
                    title: i18n('preselectToast.pinningTitle', name, roomId),
                    type: ToastType.Processing,
                })

                try {
                    const [permissions, isPublic]: UserPermissions = yield getUserPermissions(
                        owner,
                        stream
                    )

                    if (tokenAddress && !permissions.length) {
                        yield join(stream, account, {
                            retoastConstroller: toast,
                        })

                        return
                    }

                    if (!permissions.length && !isPublic) {
                        yield toast.open({
                            type: ToastType.Error,
                            title: i18n('preselectToast.unauthorizedTitle'),
                        })

                        return
                    }

                    // Only pin public rooms.
                    const pinned = !permissions.length

                    const numModded: number = yield db.rooms
                        .where({ owner, id: roomId })
                        .modify({ pinned, hidden: false })

                    if (numModded !== 0) {
                        return
                    }

                    try {
                        yield db.rooms.add({
                            createdAt,
                            createdBy,
                            id: stream.id,
                            name,
                            owner,
                            pinned,
                        })
                    } catch (e: any) {
                        // Account for race conditions…
                        if (!/uniqueness/.test(e?.message || '')) {
                            throw e
                        }
                    }

                    yield selectRoom(roomId, owner)
                } catch (e) {
                    yield toast.open({
                        type: ToastType.Error,
                        title: i18n('preselectToast.failedtoOpenTitle'),
                    })
                }
            })
        } finally {
            yield toast.dismiss({
                asap: yield cancelled(),
            })
        }
    })
}
