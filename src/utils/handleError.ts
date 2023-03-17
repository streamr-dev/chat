import Dexie from 'dexie'

export default function handleError(e: any) {
    switch (true) {
        case typeof e === 'undefined':
        case e instanceof Dexie.ConstraintError:
            // Ignore.
            break
        default:
            console.warn('No default error handler for', e)
    }
}
