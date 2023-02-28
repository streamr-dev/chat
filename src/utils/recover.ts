import Toast, { ToastType } from '$/components/Toast'
import { ComponentProps } from 'react'
import { Controller as ToastController } from '$/components/Toaster'
import toaster from '$/features/toaster/helpers/toaster'

type RecoverReturnType<T> = T extends () => Generator<any, infer U, any> ? U : never

type RecoverArgs<T> = T extends (...args: infer R) => any ? R : never

export default function* recover<T extends (...args: any[]) => Generator<any, any, any>>(
    fn: T,
    props: ComponentProps<typeof Toast>,
    ...args: RecoverArgs<T>
) {
    let tc: ToastController | undefined

    try {
        while (true) {
            try {
                const result: RecoverReturnType<T> = yield* fn(...args)

                return result
            } catch (e) {
                console.warn(e)

                try {
                    tc = yield toaster(Toast, {
                        title: 'Failed',
                        desc: 'Would you like to try again?',
                        type: ToastType.Warning,
                        okLabel: 'Yes',
                        cancelLabel: 'No',
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
}
