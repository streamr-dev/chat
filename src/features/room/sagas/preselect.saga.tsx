import Id from '$/components/Id'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { MiscAction } from '$/features/misc'
import { PreferencesAction } from '$/features/preferences'
import { IPreference } from '$/features/preferences/types'
import { RoomAction } from '$/features/room'
import { IRoom } from '$/features/room/types'
import { EnhancedStream } from '$/types'
import db from '$/utils/db'
import getStream from '$/utils/getStream'
import getStreamMetadata from '$/utils/getStreamMetadata'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import { error } from '$/utils/toaster'
import { Id as ToastId, toast } from 'react-toastify'
import { put, takeLatest } from 'redux-saga/effects'

export default function* preselect() {
    yield takeLatest(
        RoomAction.preselect,
        function* ({ payload: { roomId, account, streamrClient } }) {
            if (!account) {
                // No account means that either someone locked their wallet or we're in the middle of
                // a switch. Either way, deselect and wait for another `preselect` call.
                yield put(RoomAction.select(undefined))

                return
            }

            const owner = account.toLowerCase()

            let toastId: undefined | ToastId

            try {
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

                toastId = toast.loading(
                    <>
                        Opening <Id>{roomId}</Id>…
                    </>,
                    {
                        position: 'bottom-left',
                        autoClose: false,
                        type: 'info',
                        closeOnClick: false,
                        hideProgressBar: true,
                    }
                )

                let selectedRoom: null | IRoom = null

                try {
                    selectedRoom = yield db.rooms
                        .where({
                            owner,
                            id: roomId,
                        })
                        .first()
                } catch (e) {
                    error('Failed to find the room')

                    return
                }

                if (selectedRoom) {
                    if (selectedRoom.hidden && !preferences?.showHiddenRooms) {
                        // Room is known but it's been hidden. Let's change that.
                        try {
                            yield db.rooms.where({ owner, id: roomId }).modify({
                                hidden: false,
                            })
                        } catch (e) {
                            error('Failed to unhide the room.')
                        }
                    }

                    // At this point the room is known and unhidden. Select it!
                    yield put(RoomAction.select(roomId))

                    // …and remember our last selection.
                    yield put(
                        PreferencesAction.set({
                            owner,
                            selectedRoomId: roomId,
                        })
                    )

                    return
                }

                // The requested room isn't on the list of rooms the app knows. In the next steps
                // we're gonna make efforts to pin/bookmark it.

                toast.update(toastId, {
                    render: (
                        <>
                            Pinning <Id>{roomId}</Id>…
                        </>
                    ),
                })

                try {
                    const stream: undefined | EnhancedStream = yield getStream(
                        streamrClient,
                        roomId
                    )

                    if (!stream) {
                        throw new RoomNotFoundError(roomId)
                    }

                    const { createdAt, createdBy, name } = getStreamMetadata(stream)

                    const [permissions, isPublic]: UserPermissions = yield getUserPermissions(
                        owner,
                        stream
                    )

                    if (!permissions.length && !isPublic) {
                        error("You don't have access to the room.")
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
                            createdAt: createdAt,
                            createdBy: createdBy,
                            id: stream.id,
                            name: name || '',
                            owner,
                            pinned,
                        })
                    } catch (e: any) {
                        // Account for race conditions…
                        if (!/uniqueness/.test(e.message)) {
                            throw e
                        }
                    }

                    yield put(RoomAction.select(roomId))

                    yield put(
                        PreferencesAction.set({
                            owner,
                            selectedRoomId: roomId,
                        })
                    )
                } catch (e) {
                    error('Failed to open the room.')
                }
            } finally {
                window.setTimeout(() => {
                    // Let the toast stick around for halfa second for better UX.
                    toast.dismiss(toastId)
                }, 1000)
            }
        }
    )
}
