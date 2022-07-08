import InsufficientFundsError from '$/errors/InsufficientFundsError'
import Dexie from 'dexie'
import { error } from './toaster'

export default function handleError(e: any) {
    switch (true) {
        case e instanceof InsufficientFundsError:
            error(e.message)
            break
        case e instanceof Dexie.ConstraintError:
            // Ignore.
            break
        default:
            console.warn('No default error handler for', e)
    }
}
