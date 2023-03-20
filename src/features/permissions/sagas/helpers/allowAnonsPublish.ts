import Toast, { ToastType } from '$/components/Toast'
import { Controller as ToastController } from '$/components/Toaster'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import retoast from '$/features/toaster/helpers/retoast'
import toaster from '$/features/toaster/helpers/toaster'
import fetchStream from '$/utils/fetchStream'
import getTransactionalClient from '$/utils/getTransactionalClient'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import preflight from '$/utils/preflight'
import { call, cancelled } from 'redux-saga/effects'
import StreamrClient, { Stream, StreamPermission } from 'streamr-client'

export default function allowAnonsPublish({
    roomId,
    requester,
}: ReturnType<typeof PermissionsAction.allowAnonsPublish>['payload']) {
    return call(function* () {
        let t: ToastController<typeof Toast> | undefined

        const toast = retoast()

        try {
            yield toast.open({
                title: i18n('anonToast.title'),
                type: ToastType.Processing,
            })

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
                yield toast.open({
                    title: i18n('anonToast.cancelledTitle'),
                    type: ToastType.Info,
                })

                t = undefined

                return
            }

            const stream: Stream | null = yield fetchStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            yield preflight(requester)

            const streamrClient: StreamrClient = yield getTransactionalClient()

            yield streamrClient.setPermissions({
                streamId: roomId,
                assignments: [
                    {
                        public: true,
                        permissions: [StreamPermission.SUBSCRIBE, StreamPermission.PUBLISH],
                    },
                ],
            })

            yield toast.open({
                title: i18n('anonToast.successTitle'),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast.open({
                title: i18n('anonToast.failureTitle'),
                type: ToastType.Error,
            })
        } finally {
            yield toast.dismiss({ asap: yield cancelled() })

            t?.dismiss()
        }
    })
}
