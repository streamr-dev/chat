import Toast, { ToastType } from '$/components/Toast'
import { Controller } from '$/components/Toaster'
import toaster from '$/features/toaster/helpers/toaster'
import handleError from '$/utils/handleError'
import { ComponentProps } from 'react'
import { call, CallEffect, delay, ForkEffect, spawn } from 'redux-saga/effects'

export interface RetoastController {
    open: (props?: ComponentProps<typeof Toast>) => ForkEffect<unknown>
    dismiss: (options?: { asap?: boolean }) => CallEffect<void>
}

export default function retoast(): RetoastController {
    let ctrl: Controller | undefined

    let dismissToast = false

    let openedAt = performance.now()

    return {
        open(newProps?: ComponentProps<typeof Toast>) {
            dismissToast = newProps?.type === ToastType.Processing

            openedAt = performance.now()

            return spawn(function* () {
                try {
                    if (ctrl) {
                        return void ctrl.update({
                            autoCloseAfter: true,
                            ...(newProps || {}),
                        })
                    }

                    ctrl = yield toaster(Toast, newProps || {})

                    yield ctrl?.open(newProps)
                } catch (e) {
                    handleError(e)
                }
            })
        },
        dismiss({ asap = false } = {}) {
            const prevCtrl = ctrl

            /**
             * Setting it back to undefined allows `open` to pop up another toast. It'll be a different
             * instance (see `yield toaster(…)`).
             */
            ctrl = undefined

            return call(function* () {
                if (dismissToast || asap) {
                    /**
                     * Let's make sure each open toast stays visible for at least a second. Otherwise
                     * it's jumpy and a bit confusing.
                     */
                    const dt = Math.max(0, 1000 - (performance.now() - openedAt))

                    if (dt === 0) {
                        return void prevCtrl?.dismiss()
                    }

                    setTimeout(() => {
                        prevCtrl?.dismiss()
                    }, dt)

                    yield delay(dt)
                }
            })
        },
    }
}
