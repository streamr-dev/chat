import { call, put } from 'redux-saga/effects'
import StreamrClient, { StreamPermission } from '@streamr/sdk'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import waitForPermissions from '$/utils/waitForPermissions'
import isSameAddress from '$/utils/isSameAddress'
import i18n from '$/utils/i18n'
import getTransactionalClient from '$/utils/getTransactionalClient'
import { MiscAction } from '$/features/misc'

export default function registerRoomInvite({
    roomId,
    invitee,
}: ReturnType<typeof RoomAction.registerInvite>['payload']) {
    return call(function* () {
        try {
            const streamrClient: StreamrClient = yield getTransactionalClient()

            // Invite detector tends to trigger the invitation event prematurely. In other
            // words, at times we've gotta wait a couple of seconds for `GRANT` permission
            // to be fully established and propagated.
            yield waitForPermissions(streamrClient, roomId, (assignments) => {
                for (let i = 0; i < assignments.length; i++) {
                    const a = assignments[i]

                    if ('userId' in a && isSameAddress(a.userId, invitee)) {
                        return (
                            a.permissions.length === 2 &&
                            a.permissions.includes(StreamPermission.GRANT) &&
                            a.permissions.includes(StreamPermission.SUBSCRIBE)
                        )
                    }
                }

                return false
            })

            yield put(
                MiscAction.toast({
                    title: i18n('gotInviteToast.title'),
                    desc: i18n('gotInviteToast.desc'),
                })
            )

            yield put(
                RoomAction.fetch({
                    roomId,
                    requester: invitee,
                })
            )
        } catch (e) {
            handleError(e)
        }
    })
}
