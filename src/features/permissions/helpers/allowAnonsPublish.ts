import Toast, { ToastType } from '$/components/Toast'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import retoast from '$/features/misc/helpers/retoast'
import { toaster } from 'toasterhea'
import fetchStream from '$/utils/fetchStream'
import getTransactionalClient from '$/utils/getTransactionalClient'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import preflight from '$/utils/preflight'
import { call, cancelled } from 'redux-saga/effects'
import StreamrClient, { Stream, StreamPermission } from 'streamr-client'
import { Layer } from '$/consts'

export default function allowAnonsPublish({
    roomId,
    requester,
}: ReturnType<typeof PermissionsAction.allowAnonsPublish>['payload']) {
    return call(function* () {
        const confirm = toaster(Toast, Layer.Toast)

        const toast = retoast()

        try {
            yield toast.pop({
                title: i18n('anonToast.title'),
                type: ToastType.Processing,
            })

            try {
                yield confirm.pop({
                    title: i18n('anonToast.confirmTitle'),
                    type: ToastType.Warning,
                    desc: i18n('anonToast.confirmDesc'),
                    okLabel: i18n('anonToast.confirmOkLabel'),
                    cancelLabel: i18n('anonToast.confirmCancelLabel'),
                })
            } catch (e) {
                yield toast.pop({
                    title: i18n('anonToast.cancelledTitle'),
                    type: ToastType.Info,
                })

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

            yield toast.pop({
                title: i18n('anonToast.successTitle'),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast.pop({
                title: i18n('anonToast.failureTitle'),
                type: ToastType.Error,
            })
        } finally {
            toast.discard({ asap: yield cancelled() })

            confirm.discard()
        }
    })
}
