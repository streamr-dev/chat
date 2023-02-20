import { put } from 'redux-saga/effects'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
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
import { Stream, StreamMetadata } from 'streamr-client'
import getRoomMetadata, { RoomMetadata } from '$/utils/getRoomMetadata'

function* onRenameAction({
    payload: { roomId, name, provider, requester, streamrClient },
}: ReturnType<typeof RoomAction.rename>) {
    try {
        const stream: null | Stream = yield streamrClient.getStream(roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const roomMetadata = getRoomMetadata(stream)

        if (roomMetadata.name === name) {
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

        yield stream.update({
            description: name,
            extensions: {
                'thechat.eth': {
                    ...roomMetadata,
                    updatedAt: Date.now(),
                },
            },
        } as Partial<StreamMetadata> & Record<'extensions', Partial<Record<'thechat.eth', RoomMetadata>>>)

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
