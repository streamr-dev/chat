export default class MissingWalletAccountError extends Error {
    name = 'MissingWalletAccountError'

    constructor() {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingWalletAccountError)
        }

        Object.setPrototypeOf(this, MissingWalletAccountError.prototype)
    }
}
