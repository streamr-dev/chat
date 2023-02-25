import { RoomAction } from '$/features/room'
import { call, put } from 'redux-saga/effects'
import config from '$/config.json'
import { IPreference } from '$/features/preferences/types'
import db from '$/utils/db'
import { IRoom, RoomId } from '$/features/room/types'
import StreamrClient, { Stream } from 'streamr-client'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import handleError from '$/utils/handleError'
import getRoomMetadata from '$/utils/getRoomMetadata'
import { Address } from '$/types'
import getUserPermissions from '$/utils/getUserPermissions'
import { PreferencesAction } from '$/features/preferences'
import Toast, { ToastType } from '$/components/Toast'
import tw from 'twin.macro'
import { Controller } from '$/components/Toaster'
import toaster from '$/features/toaster/helpers/toaster'
import fetchStream from '$/utils/fetchStream'

const { stickyRoomIds } = config

function quietPin(roomId: RoomId, requester: Address, streamrClient: StreamrClient) {
    return call(function* () {
        try {
            const owner = requester.toLowerCase()

            const stream: Stream | null = yield fetchStream(roomId, streamrClient)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const { createdAt, createdBy, tokenAddress, name = '' } = getRoomMetadata(stream)

            if (tokenAddress) {
                // Skip quiet-pinning token gated rooms (by design).
                throw new Error('Cannot pin a token gated room')
            }

            const room: undefined | IRoom = yield db.rooms.where({ id: stream.id, owner }).first()

            const [permissions, isPublic]: Awaited<ReturnType<typeof getUserPermissions>> =
                yield getUserPermissions(owner, stream)

            if (permissions.length) {
                // Nothing to do. The user already has the room on their room list.
                throw new Error("Cannot pin user's own room")
            }

            if (!isPublic) {
                // Skip quiet-pinning private rooms. It's designed for public rooms.
                throw new Error('Cannot pin a private room')
            }

            if (room) {
                yield db.rooms.where({ owner, id: roomId }).modify({ pinned: true, hidden: false })
            } else {
                try {
                    yield db.rooms.add({
                        createdAt,
                        createdBy,
                        id: stream.id,
                        name,
                        owner,
                        pinned: true,
                    })
                } catch (e: any) {
                    if (!/uniqueness/.test(e?.message || '')) {
                        throw e
                    }
                }
            }

            return name || 'Unnamed room'
        } catch (e) {
            handleError(e)
        }
    })
}

export default function pinSticky({
    requester,
    streamrClient,
}: ReturnType<typeof RoomAction.pinSticky>['payload']) {
    return call(function* () {
        let t: Controller<typeof Toast> | undefined

        try {
            if (!stickyRoomIds.length) {
                // Nothing to pin.
                return
            }

            const owner = requester.toLowerCase()

            let preferences: IPreference | null

            try {
                preferences = yield db.preferences.where({ owner }).first()
            } catch (e) {
                // Let's not bother the user if we failed to load their preferences. Skip.
                return
            }

            const { stickyRoomIds: ids = [] } = preferences || {}

            const newPins: [RoomId, string][] = []

            const newIds: RoomId[] = []

            for (let i = 0; i < stickyRoomIds.length; i++) {
                const { id } = stickyRoomIds[i]

                if (!ids.includes(id)) {
                    const pinName: undefined | string = yield quietPin(id, requester, streamrClient)

                    newIds.push(id)

                    if (typeof pinName === 'string') {
                        newPins.push([id, pinName])
                    }
                }
            }

            yield put(
                PreferencesAction.set({
                    owner,
                    stickyRoomIds: [...ids, ...newIds],
                })
            )

            const n = newPins.length

            if (!n) {
                return
            }

            try {
                t = yield toaster({
                    title: `Pinned ${n} new sticky room${n === 1 ? '' : 's'}`,
                    type: ToastType.Info,
                    desc: (
                        <ol css={tw`text-[14px] list-decimal`}>
                            {newPins.map(([id, name]) => (
                                <li key={id}>{name}</li>
                            ))}
                        </ol>
                    ),
                    okLabel: 'Dismiss',
                })

                yield t?.open()
            } catch (e) {
                t = undefined
            }
        } catch (e) {
            handleError(e)
        } finally {
            t?.dismiss()
        }
    })
}
