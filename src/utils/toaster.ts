import { ReactNode } from 'react'
import { toast, ToastOptions } from 'react-toastify'

const Options: ToastOptions = {
    position: 'top-center',
}

export function error(message: ReactNode) {
    return toast.error(message, Options)
}

export function success(message: ReactNode) {
    return toast.success(message, Options)
}

export function info(message: ReactNode) {
    return toast.info(message, Options)
}

export function loading(message: ReactNode) {
    return toast.loading(message, {
        position: 'bottom-left',
        autoClose: false,
        type: 'info',
        closeOnClick: false,
        hideProgressBar: true,
    })
}
