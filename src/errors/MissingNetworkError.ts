export default class MissingNetworkError extends Error {
    name = 'MissingNetworkError'

    constructor() {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingNetworkError)
        }

        Object.setPrototypeOf(this, MissingNetworkError.prototype)
    }
}
