import Toast from '$/components/Toast'
import { Controller as ToastController, ToasterCallback } from '$/components/Toaster'
import { State } from '$/types'
import handleError from '$/utils/handleError'
import { ComponentProps } from 'react'
import { call, select, spawn } from 'redux-saga/effects'

export type Controller = Pick<ToastController<typeof Toast>, 'dismiss' | 'update'>

export default function toast(props: ComponentProps<typeof Toast>) {
    return call(function* () {
        let cb: ToasterCallback | undefined = yield select(
            ({ toaster: { instance } }: State) => instance
        )

        if (!cb) {
            console.warn('No toaster? No toasts!')

            cb = () => ({
                dismiss() {
                    // Do nothing
                },
                async open() {
                    // Do nothing
                },
                update() {
                    // Do nothing
                },
            })
        }

        const { open, dismiss, update } = cb(Toast, props)

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
