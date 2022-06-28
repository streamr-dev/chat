export default class RedundantRenameError extends Error {
    name = 'RedundantRenameError'

    constructor() {
        super('Room name has not changed.')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RedundantRenameError)
        }

        Object.setPrototypeOf(this, RedundantRenameError.prototype)
    }
}
