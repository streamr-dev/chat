import { ToastType } from '$/components/Toast'
import { RoomAction } from '$/features/room'
import toast from '$/features/toaster/helpers/toast'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import i18n from '$/utils/I18n'
import { takeEvery } from 'redux-saga/effects'

function* onSetVisibilityAction({
    payload: { roomId, owner, visible },
}: ReturnType<typeof RoomAction.setVisibility>) {
    try {
        yield db.rooms
            .where({ id: roomId, owner: owner.toLowerCase() })
            .modify({ hidden: !visible })
    } catch (e) {
        handleError(e)

        yield toast({
            title: i18n('roomVisibilityToast.failedToToggleTitle'),
            type: ToastType.Error,
        })
    }
}

export default function* setVisibility() {
    yield takeEvery(RoomAction.setVisibility, onSetVisibilityAction)
}
