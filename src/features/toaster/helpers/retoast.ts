import Toast from '$/components/Toast'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { ComponentProps } from 'react'
import { call } from 'redux-saga/effects'

export default function retoast(tc: Controller | undefined, props: ComponentProps<typeof Toast>) {
    if (tc) {
        return call(function () {
            tc.update({
                autoCloseAfter: true,
                ...props,
            })

            return tc
        })
    }

    return toast(props)
}
