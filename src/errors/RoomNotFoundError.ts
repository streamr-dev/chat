import { RoomId } from '$/features/room/types'

export default class RoomNotFoundError extends Error {
    name = 'RoomNotFoundError'

    constructor(readonly roomId: RoomId) {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RoomNotFoundError)
        }

        Object.setPrototypeOf(this, RoomNotFoundError.prototype)
    }
}
