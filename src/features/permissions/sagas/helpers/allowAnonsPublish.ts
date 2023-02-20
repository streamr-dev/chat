import Toast, { ToastType } from '$/components/Toast'
import { Controller as ToastController } from '$/components/Toaster'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import retoast from '$/features/toaster/helpers/retoast'
import { Controller } from '$/features/toaster/helpers/toast'
import toaster from '$/features/toaster/helpers/toaster'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { call } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'

export default function allowAnonsPublish({
    roomId,
    provider,
    requester,
    streamrClient,
}: ReturnType<typeof PermissionsAction.allowAnonsPublish>['payload']) {
    return call(function* () {
        let t: ToastController<typeof Toast> | undefined

        let tc: Controller | undefined

        let dismissToast = false

        try {
            tc = yield retoast(tc, {
                title: 'Granting anons more rights…',
                type: ToastType.Processing,
            })

            dismissToast = true

            try {
                t = yield toaster({
                    title: 'Are you sure?',
                    type: ToastType.Warning,
                    desc: 'Anyone will be able to read and send messages in this room.',
                    okLabel: 'Yes',
                    cancelLabel: 'Cancel',
                })

                yield t?.open()
            } catch (e) {
                dismissToast = false

                tc = yield retoast(tc, {
                    title: 'Maybe another time!',
                    type: ToastType.Info,
                })

                t = undefined

                return
            }

            yield preflight({
                provider,
                requester,
            })

            const stream: null | Stream = yield streamrClient.getStream(roomId)

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
                title: 'Done',
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            dismissToast = false

            tc = yield retoast(tc, {
                title: 'Failed to give anons more rights',
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
