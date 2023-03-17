import { ToastType } from '$/components/Toast'
import { RoomAction } from '$/features/room'
import { ToasterAction } from '$/features/toaster'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import { put, takeEvery } from 'redux-saga/effects'

function* onSetVisibilityAction({
    payload: { roomId, owner, visible },
}: ReturnType<typeof RoomAction.setVisibility>) {
    try {
        yield db.rooms
            .where({ id: roomId, owner: owner.toLowerCase() })
            .modify({ hidden: !visible })
    } catch (e) {
        handleError(e)

        yield put(
            ToasterAction.show({
                title: i18n('roomVisibilityToast.failedToToggleTitle'),
                type: ToastType.Error,
            })
        )
    }
}

export default function* setVisibility() {
    yield takeEvery(RoomAction.setVisibility, onSetVisibilityAction)
}
