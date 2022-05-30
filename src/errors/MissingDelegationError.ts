import { Address } from '../../types/common'

export default class MissingDelegationError extends Error {
    name = 'MissingDelegationError'

    constructor(readonly address: Address) {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingDelegationError)
        }

        Object.setPrototypeOf(this, MissingDelegationError.prototype)
    }
}
