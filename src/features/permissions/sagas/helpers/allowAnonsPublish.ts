import Toast, { ToastType } from '$/components/Toast'
import { Controller as ToastController } from '$/components/Toaster'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import retoast from '$/features/toaster/helpers/retoast'
import { Controller } from '$/features/toaster/helpers/toast'
import toaster from '$/features/toaster/helpers/toaster'
import fetchStream from '$/utils/fetchStream'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import preflight from '$/utils/preflight'
import { call } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'

export default function allowAnonsPublish({
    roomId,
    requester,
    streamrClient,
}: ReturnType<typeof PermissionsAction.allowAnonsPublish>['payload']) {
    return call(function* () {
        let t: ToastController<typeof Toast> | undefined

        let tc: Controller | undefined

        let dismissToast = false

        try {
            tc = yield retoast(tc, {
                title: i18n('anonToast.title'),
                type: ToastType.Processing,
            })

            dismissToast = true

            try {
                t = yield toaster(Toast, {
                    title: i18n('anonToast.confirmTitle'),
                    type: ToastType.Warning,
                    desc: i18n('anonToast.confirmDesc'),
                    okLabel: i18n('anonToast.confirmOkLabel'),
                    cancelLabel: i18n('anonToast.confirmCancelLabel'),
                })

                yield t?.open()
            } catch (e) {
                dismissToast = false

                tc = yield retoast(tc, {
                    title: i18n('anonToast.cancelledTitle'),
                    type: ToastType.Info,
                })

                t = undefined

                return
            }

            yield preflight(requester)

            const stream: Stream | null = yield fetchStream(roomId, streamrClient)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            yield streamrClient.setPermissions({
                streamId: roomId,
                assignments: [
                    {
                        public: true,
                        permissions: [StreamPermission.SUBSCRIBE, StreamPermission.PUBLISH],
                    },
                ],
            })

            dismissToast = false

            tc = yield retoast(tc, {
                title: i18n('anonToast.successTitle'),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            dismissToast = false

            tc = yield retoast(tc, {
                title: i18n('anonToast.failureTitle'),
                type: ToastType.Error,
            })
        } finally {
            if (dismissToast) {
                tc?.dismiss()
            }

            t?.dismiss()
        }
    })
}
