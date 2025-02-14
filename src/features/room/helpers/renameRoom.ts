import { ToastType } from '$/components/Toast'
import RedundantRenameError from '$/errors/RedundantRenameError'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { IRoom } from '$/features/room/types'
import db from '$/utils/db'
import fetchStream from '$/utils/fetchStream'
import getRoomMetadata, {
    ParsedStreamMetadata,
    parseStreamMetadata,
    RoomMetadata,
} from '$/utils/getRoomMetadata'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import preflight from '$/utils/preflight'
import { Stream, StreamMetadata } from '@streamr/sdk'
import { call, put } from 'redux-saga/effects'
import { RoomAction } from '..'

export default function renameRoom({
    roomId,
    name,
    requester,
}: ReturnType<typeof RoomAction.rename>['payload']) {
    return call(function* () {
        try {
            const stream: Stream | null = yield fetchStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const { name: persistedName, ...roomMetadata }: RoomMetadata = yield getRoomMetadata(
                stream
            )

            const { client: _, ...streamMetadata }: ParsedStreamMetadata =
                yield parseStreamMetadata(yield stream.getMetadata())

            if (persistedName === name) {
                yield put(
                    MiscAction.toast({
                        title: i18n('roomRenameToast.upToDateTitle'),
                        type: ToastType.Info,
                    })
                )

                try {
                    /**
                     * Let's check if the name of the room cached locally is equal to the remote
                     * room's name. Trigger a sync if it's not.
                     */
                    const room: undefined | IRoom = yield db.rooms
                        .where('id')
                        .equals(roomId)
                        .first()

                    if (room && room.name !== name) {
                        // Current local name and current remote names don't match up. Let's sync.
                        yield put(
                            RoomAction.sync({
                                roomId,
                                requester,
                                fingerprint: Flag.isSyncingRoom(roomId),
                            })
                        )
                    }
                } catch (e) {
                    handleError(e)
                }

                throw new RedundantRenameError()
            }

            yield preflight(requester)

            yield stream.setMetadata({
                ...streamMetadata,
                description: name,
                extensions: {
                    ...streamMetadata.extensions,
                    'thechat.eth': {
                        ...roomMetadata,
                        updatedAt: Date.now(),
                    },
                },
            })

            yield put(
                RoomAction.renameLocal({
                    roomId,
                    name,
                })
            )

            yield put(FlagAction.unset(Flag.isRoomNameBeingEdited(roomId)))

            yield put(
                MiscAction.toast({
                    title: i18n('roomRenameToast.successTitle'),
                    type: ToastType.Success,
                })
            )
        } catch (e) {
            if (e instanceof RedundantRenameError) {
                return
            }

            handleError(e)

            yield put(
                MiscAction.toast({
                    title: i18n('roomRenameToast.failureTitle'),
                    type: ToastType.Error,
                })
            )
        }
    })
}
