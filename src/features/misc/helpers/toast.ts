import Toast from '$/components/Toast'
import { MiscAction } from '$/features/misc'
import handleError from '$/utils/handleError'
import { Layer, toaster } from '$/utils/toaster'
import { spawn } from 'redux-saga/effects'

export default function toast(props: ReturnType<typeof MiscAction.toast>['payload']) {
    return spawn(function* () {
        try {
            yield toaster(Toast, Layer.Toast).pop(props)
        } catch (e) {
            handleError(e)
        }
    })
}
