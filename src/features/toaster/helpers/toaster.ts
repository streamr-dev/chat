import Toast from '$/components/Toast'
import { ToasterCallback } from '$/components/Toaster'
import { State } from '$/types'
import { ComponentProps } from 'react'
import { call, select } from 'redux-saga/effects'

export default function toaster(props: ComponentProps<typeof Toast>) {
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

        return cb(Toast, props)
    })
}
