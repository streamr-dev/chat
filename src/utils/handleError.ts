import { Reason } from 'toasterhea'
import Dexie from 'dexie'

export default function handleError(e: any) {
    switch (true) {
        case e === Reason.Host:
        case e === Reason.Unmount:
        case e === Reason.Update:
        case typeof e === 'undefined':
        case e instanceof Dexie.ConstraintError:
            // Ignore.
            break
        default:
            console.warn('No default error handler for', e)
    }
}
