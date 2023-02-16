import Toast from '$/components/Toast'
import { ToasterCallback } from '$/components/Toster'
import { State } from '$/types'
import handleError from '$/utils/handleError'
import { ComponentProps } from 'react'
import { call, select } from 'redux-saga/effects'

export default function toaster() {
    return call(function* () {
        const cb: ToasterCallback | undefined = yield select(
            ({ toaster: { instance } }: State) => instance
        )

        if (!cb) {
            console.warn('No toster? No toasts!')
        }

        return (
            cb ||
            (() => ({
                dismiss() {},
                async open() {},
                update() {},
            }))
        )
    })
}
