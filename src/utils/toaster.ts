import { toast, ToastOptions } from 'react-toastify'

const Options: ToastOptions = {
    position: 'top-center',
}

export function error(message: string) {
    toast.error(message, Options)
}

export function success(message: string) {
    toast.success(message, Options)
}
