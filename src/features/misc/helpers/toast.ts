import Toast from '$/components/Toast'
import { MiscAction } from '$/features/misc'
import handleError from '$/utils/handleError'
import { toaster } from 'toasterhea'
import { spawn } from 'redux-saga/effects'
import { Layer } from '$/consts'

export default function toast(props: ReturnType<typeof MiscAction.toast>['payload']) {
    return spawn(function* () {
        try {
            yield toaster(Toast, Layer.Toast).pop(props)
        } catch (e) {
            handleError(e)
        }
    })
}
