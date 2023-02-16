import Toast from '$/components/Toast'
import { Controller as ToastController, ToasterCallback } from '$/components/Toster'
import toaster from '$/features/toaster/helpers/toaster'
import handleError from '$/utils/handleError'
import { ComponentProps } from 'react'
import { call, spawn } from 'redux-saga/effects'

export type Controller = Pick<ToastController<typeof Toast>, 'dismiss' | 'update'>

export default function toast(props: ComponentProps<typeof Toast>) {
    return call(function* () {
        const t: ToasterCallback = yield toaster()

        const { open, dismiss, update } = t(Toast, props)

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
