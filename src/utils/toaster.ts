import { ReactNode } from 'react'
import { toast, ToastOptions } from 'react-toastify'

const Options: ToastOptions = {
    position: 'top-center',
}

export function error(message: ReactNode) {
    toast.error(message, Options)
}

export function success(message: ReactNode) {
    toast.success(message, Options)
}

export function info(message: ReactNode) {
    toast.info(message, Options)
}
