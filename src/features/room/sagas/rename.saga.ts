import { put } from 'redux-saga/effects'
import { EnhancedStream } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import getStream from '$/utils/getStream'
import preflight from '$/utils/preflight'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import { error, info, success } from '$/utils/toaster'
import { IRoom } from '$/features/room/types'
import db from '$/utils/db'
import RedundantRenameError from '$/errors/RedundantRenameError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { Flag } from '$/features/flag/types'
import { FlagAction } from '$/features/flag'
import getStreamMetadata from '$/utils/getStreamMetadata'

function* onRenameAction({
    payload: { roomId, name, provider, requester, streamrClient },
}: ReturnType<typeof RoomAction.rename>) {
    try {
        const stream: undefined | EnhancedStream = yield getStream(streamrClient, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const { name: oldName } = getStreamMetadata(stream)

        if (oldName === name) {
            info('Room name is already up-to-date.')

            try {
                const room: undefined | IRoom = yield db.rooms.where('id').equals(roomId).first()

                if (room && room.name !== name) {
                    // Current local name and current remote names don't match up. Let's sync.
                    yield put(
                        RoomAction.sync({
                            roomId,
                            requester,
                            streamrClient,
                            fingerprint: Flag.isSyncingRoom(roomId),
                        })
                    )
                }
            } catch (e) {
                handleError(e)
            }

            throw new RedundantRenameError()
        }

        yield preflight({
            provider,
            requester,
        })

        const originalMetadata = stream.getMetadata() as any

        yield stream.update({
            ...originalMetadata,
            description: name,
            extensions: {
                thechat: {
                    ...originalMetadata.extensions.thechat,
                    updatedAt: Date.now(),
                },
            },
        } as any)

        yield put(
            RoomAction.renameLocal({
                roomId,
                name,
            })
        )

        yield put(FlagAction.unset(Flag.isRoomNameBeingEdited(roomId)))

        success('Room renamed successfully.')
    } catch (e) {
        if (e instanceof RedundantRenameError) {
            return
        }

        handleError(e)

        error('Failed to rename the room.')
    }
}

export default function* rename() {
    yield takeEveryUnique(RoomAction.rename, onRenameAction)
}
