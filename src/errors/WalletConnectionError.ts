export default class WalletConnectionError extends Error {
    name = 'WalletConnectionError'

    constructor() {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, WalletConnectionError)
        }

        Object.setPrototypeOf(this, WalletConnectionError.prototype)
    }
}
