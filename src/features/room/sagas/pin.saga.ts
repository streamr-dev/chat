import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PreferencesAction } from '$/features/preferences'
import { RoomAction } from '$/features/room'
import { selectIsPinning } from '$/features/room/selectors'
import { IRoom, RoomId } from '$/features/room/types'
import getWalletClient from '$/sagas/getWalletClient.saga'
import { Address, EnhancedStream } from '$/types'
import db from '$/utils/db'
import getStream from '$/utils/getStream'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import handleError from '$/utils/handleError'
import { error } from '$/utils/toaster'
import { toast } from 'react-toastify'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'

function* pinRemote(owner: Address, roomId: RoomId) {
    const client: StreamrClient = yield call(getWalletClient)

    const stream: undefined | EnhancedStream = yield getStream(client, roomId)

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

function* onPinUnpinAction({
    type,
    payload: { owner: address, roomId },
}: ReturnType<typeof RoomAction.pin | typeof RoomAction.unpin>) {
    let dirty = false

    let toastId

    const owner = address.toLowerCase()

    const pinned = type === RoomAction.pin.toString()

    try {
        const isPinning: boolean = yield select(selectIsPinning(owner, roomId))

        if (isPinning) {
            return
        }

        yield put(
            RoomAction.setPinning({
                owner,
                roomId,
                state: true,
            })
        )

        dirty = true

        if (pinned) {
            toastId = toast.loading(`Pinning "${roomId}"…`, {
                position: 'bottom-left',
                autoClose: false,
                type: 'info',
                closeOnClick: false,
                hideProgressBar: true,
            })
        }

        if (pinned) {
            yield call(pinRemote, owner, roomId)
            return
        }

        yield db.rooms.where({ owner, id: roomId }).modify({ pinned })

        yield put(RoomAction.sync(roomId))
    } catch (e) {
        handleError(e)

        error(pinned ? 'Pinning failed.' : 'Unpinning failed.')
    } finally {
        if (dirty) {
            yield put(
                RoomAction.setPinning({
                    owner,
                    roomId,
                    state: false,
                })
            )
        }

        if (toastId) {
            toast.dismiss(toastId)
        }
    }
}

export default function* pin() {
    yield takeEvery(RoomAction.pin, onPinUnpinAction)
    yield takeEvery(RoomAction.unpin, onPinUnpinAction)
}
