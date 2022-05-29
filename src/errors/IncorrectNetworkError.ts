export default class IncorrectNetworkError extends Error {
    name = 'IncorrectNetworkError'

    constructor(expectedId: number, actualId: number) {
        super(
            `Current network ID (${actualId}) does not match the expected network ID (${expectedId}).`
        )

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IncorrectNetworkError)
        }

        Object.setPrototypeOf(this, IncorrectNetworkError.prototype)
    }
}
