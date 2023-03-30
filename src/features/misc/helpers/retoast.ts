import { ComponentProps } from 'react'
import Toast, { ToastType } from '$/components/Toast'
import { ForkEffect, spawn } from 'redux-saga/effects'
import { Toaster, toaster } from 'toasterhea'
import handleError from '$/utils/handleError'
import { Layer } from '$/consts'

export interface RetoastController {
    pop: (props?: ComponentProps<typeof Toast>) => ForkEffect<unknown>
    discard: ({ asap }: { asap?: boolean }) => void
}

export default function retoast(): RetoastController {
    let t: Toaster<typeof Toast> | undefined

    let dismissToast = false

    return {
        pop(props = {}) {
            dismissToast = props.type === ToastType.Processing

            return spawn(function* () {
                try {
                    if (!t) {
                        t = toaster(Toast, Layer.Toast)
                    }

                    yield t.pop({
                        autoCloseAfter: true,
                        ...props,
                    })
                } catch (e) {
                    handleError(e)
                }
            })
        },
        discard({ asap = false }: { asap?: boolean } = {}) {
            if (dismissToast || asap) {
                t?.discard()
            }
        },
    }
}
