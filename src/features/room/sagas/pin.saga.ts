import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PreferencesAction } from '$/features/preferences'
import { RoomAction } from '$/features/room'
import { IRoom, RoomId } from '$/features/room/types'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { isTokenGatedRoom } from '$/features/tokenGatedRooms/utils/isTokenGatedRoom'
import { Address, EnhancedStream } from '$/types'
import db from '$/utils/db'
import getStream from '$/utils/getStream'
import getStreamMetadata from '$/utils/getStreamMetadata'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error } from '$/utils/toaster'
import { Provider } from '@web3-react/types'
import { toast } from 'react-toastify'
import { call, put } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'

interface PinRemoteOptions {
    streamrClient: StreamrClient
}

function* pinRemote(
    owner: Address,
    roomId: RoomId,
    delegatedAccount: Address,
    provider: Provider,
    { streamrClient }: PinRemoteOptions
) {
    const stream: undefined | EnhancedStream = yield getStream(streamrClient, roomId)

    if (!stream) {
        throw new RoomNotFoundError(roomId)
    }

    const { createdAt, createdBy, tokenAddress, name, tokenId, tokenType } =
        getStreamMetadata(stream)

    const isTokenGated = isTokenGatedRoom(stream)

    if (isTokenGated && tokenAddress && tokenId && tokenType) {
        yield put(
            TokenGatedRoomAction.join({
                roomId,
                tokenAddress,
                provider,
                tokenId,
                tokenType,
                stakingEnabled: false,
            })
        )
    }
    const room: undefined | IRoom = yield db.rooms.where({ id: stream.id, owner }).first()

    const [permissions, isPublic]: UserPermissions = yield getUserPermissions(owner, stream)

    if (permissions.length) {
        error('Pinning is redundant. You should already have the room on your list.')
        return
    }

    if (!isPublic && !isTokenGated) {
        error("You can't pin private rooms.")
        return
    }

    if (room) {
        yield db.rooms.where({ owner, id: roomId }).modify({ pinned: true, hidden: false })
    } else {
        yield db.rooms.add({
            createdAt: createdAt,
            createdBy: createdBy,
            id: stream.id,
            name: name || '',
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
    payload: { roomId, requester, streamrClient, delegatedAccount, provider },
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

        yield call(pinRemote, requester.toLowerCase(), roomId, delegatedAccount, provider, {
            streamrClient,
        })
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
