import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PreferencesAction } from '$/features/preferences'
import { RoomAction } from '$/features/room'
import { IRoom, RoomId } from '$/features/room/types'
import { Address, EnhancedStream } from '$/types'
import db from '$/utils/db'
import getStream from '$/utils/getStream'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error } from '$/utils/toaster'
import { toast } from 'react-toastify'
import { call, put } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'

interface PinRemoteOptions {
    streamrClient: StreamrClient
}

function* pinRemote(owner: Address, roomId: RoomId, { streamrClient }: PinRemoteOptions) {
    const stream: undefined | EnhancedStream = yield getStream(streamrClient, roomId)

    if (!stream) {
        throw new RoomNotFoundError(roomId)
    }

    const metadata = stream.extensions['thechat.eth']

    const room: undefined | IRoom = yield db.rooms.where({ id: stream.id, owner }).first()

    const [permissions, isPublic]: UserPermissions = yield getUserPermissions(owner, stream)

    if (permissions.length) {
        error('Pinning is redundant. You should already have the room on your list.')
        return
    }

    if (!isPublic) {
        error("You can't pin private rooms.")
        return
    }

    if (room) {
        yield db.rooms.where({ owner, id: roomId }).modify({ pinned: true, hidden: false })
    } else {
        yield db.rooms.add({
            createdAt: metadata.createdAt,
            createdBy: metadata.createdBy,
            id: stream.id,
            name: stream.description || '',
            owner,
            pinned: true,
        })
    }

    yield put(
        PreferencesAction.set({
            owner,
            selectedRoomId: roomId,
        })
    )
}

function* onPinAction({
    payload: { roomId, requester, streamrClient },
}: ReturnType<typeof RoomAction.pin>) {
    let toastId

    try {
        toastId = toast.loading(`Pinning "${roomId}"…`, {
            position: 'bottom-left',
            autoClose: false,
            type: 'info',
            closeOnClick: false,
            hideProgressBar: true,
        })

        yield call(pinRemote, requester.toLowerCase(), roomId, { streamrClient })
    } catch (e) {
        handleError(e)

        error('Pinning failed.')
    } finally {
        if (toastId) {
            toast.dismiss(toastId)
        }
    }
}

export default function* pin() {
    yield takeEveryUnique(RoomAction.pin, onPinAction)
}
