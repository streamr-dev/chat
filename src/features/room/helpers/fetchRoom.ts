import { call } from 'redux-saga/effects'
import { RoomAction } from '..'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { IRoom } from '../types'
import { Stream } from 'streamr-client'
import getRoomMetadata from '$/utils/getRoomMetadata'
import fetchStream from '$/utils/fetchStream'

export default function fetchRoom({
    roomId,
    requester,
}: ReturnType<typeof RoomAction.fetch>['payload']) {
    return call(function* () {
        try {
            const stream: Stream | null = yield fetchStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const { createdAt, createdBy, name = '' } = getRoomMetadata(stream)

            const owner = requester.toLowerCase()

            const existing: undefined | IRoom = yield db.rooms
                .where({ id: stream.id, owner })
                .first()

            if (existing) {
                return
            }

            return db.rooms.add({
                createdAt,
                createdBy,
                id: stream.id,
                name,
                owner,
            })
        } catch (e) {
            handleError(e)
        }
    })
}
