export default class MissingDelegatedClientError extends Error {
    name = 'MissingDelegatedClientError'

    constructor() {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingDelegatedClientError)
        }

        Object.setPrototypeOf(this, MissingDelegatedClientError.prototype)
    }
}
