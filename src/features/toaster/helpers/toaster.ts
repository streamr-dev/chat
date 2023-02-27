import { ToasterCallback } from '$/components/Toaster'
import { State } from '$/types'
import { ComponentProps, FC } from 'react'
import { call, select } from 'redux-saga/effects'

export default function toaster<T extends FC<any>>(component: T, props: ComponentProps<T>) {
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

        return cb(component, props)
    })
}
