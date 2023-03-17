import Toast, { ToastType } from '$/components/Toast'
import { ComponentProps } from 'react'
import { Controller as ToastController } from '$/components/Toaster'
import toaster from '$/features/toaster/helpers/toaster'
import i18n from '$/utils/i18n'
import { call } from 'redux-saga/effects'

type RecoverReturnType<T> = T extends () => Generator<any, infer U, any> ? U : never

type RecoverArgs<T> = T extends (...args: infer R) => any ? R : never

export default function* recover<T extends (...args: any[]) => Generator<any, any, any>>(
    fn: T,
    props: ComponentProps<typeof Toast>,
    ...args: RecoverArgs<T>
) {
    const result: RecoverReturnType<T> = yield call(function* () {
        let tc: ToastController | undefined

        try {
            while (true) {
                try {
                    return (yield call(fn, ...args)) as RecoverReturnType<T>
                } catch (e) {
                    console.warn(e)

                    try {
                        tc = yield toaster(Toast, {
                            title: i18n('recoverToast.title'),
                            desc: i18n('recoverToast.desc'),
                            type: ToastType.Error,
                            okLabel: i18n('recoverToast.okLabel'),
                            cancelLabel: i18n('recoverToast.cancelLabel'),
                            ...props,
                        })

                        yield tc?.open()
                    } catch (_) {
                        throw e
                    }
                }
            }
        } finally {
            tc?.dismiss()
        }
    })

    return result
}
