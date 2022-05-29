export default class InsufficientFundsError extends Error {
    name = 'InsufficientFundsError'

    constructor() {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InsufficientFundsError)
        }

        Object.setPrototypeOf(this, InsufficientFundsError.prototype)
    }
}
