export default class InsufficientFundsError extends Error {
    name = 'InsufficientFundsError'

    constructor() {
        super("You don't have enough MATIC.")

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InsufficientFundsError)
        }

        Object.setPrototypeOf(this, InsufficientFundsError.prototype)
    }
}
