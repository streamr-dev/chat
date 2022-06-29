export default class MemberExistsError extends Error {
    name = 'MemberExistsError'

    constructor(readonly member: string) {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MemberExistsError)
        }

        Object.setPrototypeOf(this, MemberExistsError.prototype)
    }
}
