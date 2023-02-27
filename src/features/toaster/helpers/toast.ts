import Toast from '$/components/Toast'
import { Controller as ToastController } from '$/components/Toaster'
import toaster from '$/features/toaster/helpers/toaster'
import handleError from '$/utils/handleError'
import { ComponentProps } from 'react'
import { call, spawn } from 'redux-saga/effects'

export type Controller = Pick<ToastController<typeof Toast>, 'dismiss' | 'update'>

export default function toast(props: ComponentProps<typeof Toast>) {
    return call(function* () {
        const { open, dismiss, update }: ToastController<typeof Toast> = yield toaster(Toast, props)

        yield spawn(function* () {
            try {
                yield open()
            } catch (e) {
                handleError(e)
            }
        })

        return {
            dismiss,
            update,
        } as Controller
    })
}
