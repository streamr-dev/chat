export default class MissingWalletProviderError extends Error {
    name = 'MissingWalletProviderError'

    constructor() {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingWalletProviderError)
        }

        Object.setPrototypeOf(this, MissingWalletProviderError.prototype)
    }
}
