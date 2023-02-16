import Toast from '$/components/Toast'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { ComponentProps } from 'react'
import { call } from 'redux-saga/effects'

export default function retoast(tc: Controller | undefined, props: ComponentProps<typeof Toast>) {
    return call(function () {
        if (tc) {
            tc.update(props)

            return tc
        }

        return toast(props)
    })
}
