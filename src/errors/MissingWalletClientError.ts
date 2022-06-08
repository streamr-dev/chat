export default class MissingWalletClientError extends Error {
    name = 'MissingWalletClientError'

    constructor() {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingWalletClientError)
        }

        Object.setPrototypeOf(this, MissingWalletClientError.prototype)
    }
}
