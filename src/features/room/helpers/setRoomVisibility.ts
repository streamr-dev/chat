import { ToastType } from '$/components/Toast'
import { RoomAction } from '$/features/room'
import { MiscAction } from '$/features/misc'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import { call, put } from 'redux-saga/effects'

export default function setRoomVisibility({
    roomId,
    owner,
    visible,
}: ReturnType<typeof RoomAction.setVisibility>['payload']) {
    return call(function* () {
        try {
            yield db.rooms
                .where({ id: roomId, owner: owner.toLowerCase() })
                .modify({ hidden: !visible })
        } catch (e) {
            handleError(e)

            yield put(
                MiscAction.toast({
                    title: i18n('roomVisibilityToast.failedToToggleTitle'),
                    type: ToastType.Error,
                })
            )
        }
    })
}
