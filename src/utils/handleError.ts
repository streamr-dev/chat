import { toast } from 'react-toastify'
import InsufficientFundsError from '../errors/InsufficientFundsError'

export default function handleError(e: any) {
    switch (true) {
        case e instanceof InsufficientFundsError:
            toast.error(e.message, {
                position: 'top-center',
            })
            break
        default:
            console.warn('No default error handler for', e)
    }
}
