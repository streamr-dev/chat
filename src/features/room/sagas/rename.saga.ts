import { Provider } from '@web3-react/types'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address, EnhancedStream } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import getStream from '$/utils/getStream'
import preflight from '$/utils/preflight'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import getWalletProvider from '$/sagas/getWalletProvider.saga'
import getWalletAccount from '$/sagas/getWalletAccount.saga'
import getWalletClient from '$/sagas/getWalletClient.saga'
import { selectPersistingRoomName } from '$/features/room/selectors'
import { error, info, success } from '$/utils/toaster'
import { IRoom } from '$/features/room/types'
import db from '$/utils/db'

function* onRenameAction({ payload: { roomId, name } }: ReturnType<typeof RoomAction.rename>) {
    let dirty = false

    let succeeded = false

    let skipped = false

    try {
        const persisting: boolean = yield select(selectPersistingRoomName(roomId))

        if (persisting) {
            return
        }

        yield put(RoomAction.setPersistingName({ roomId, state: true }))

        dirty = true

        const client: StreamrClient = yield call(getWalletClient)

        const stream: undefined | EnhancedStream = yield getStream(client, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        if (stream.description === name) {
            info('Room name is already up-to-date.')

            try {
                const room: undefined | IRoom = yield db.rooms.where('id').equals(roomId).first()

                if (room && room.name !== name) {
                    // Current local name and current remote names don't match up. Let's sync.
                    yield put(RoomAction.sync(roomId))
                }
            } catch (e) {
                handleError(e)
            }

            skipped = true

            return
        }

        const provider: Provider = yield call(getWalletProvider)

        const requester: Address = yield call(getWalletAccount)

        yield preflight({
            provider,
            requester,
        })

        stream.description = name

        stream.extensions['thechat.eth'].updatedAt = Date.now()

        yield stream.update()

        yield put(
            RoomAction.renameLocal({
                roomId,
                name,
            })
        )

        succeeded = true
    } catch (e) {
        handleError(e)
    } finally {
        if (dirty) {
            yield put(RoomAction.setPersistingName({ roomId, state: false }))
        }

        if (succeeded) {
            yield put(RoomAction.setEditingName({ roomId, state: false }))

            success('Room renamed successfully.')
        } else {
            if (!skipped) {
                error('Failed to rename the room.')
            }
        }
    }
}

export default function* rename() {
    yield takeEvery(RoomAction.rename, onRenameAction)
}
