import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import getWalletClientSaga from '../../../sagas/getWalletClientSaga'
import web3PreflightSaga from '../../../sagas/web3PreflightSaga'
import handleError from '../../../utils/handleError'
import { detectMembers, MemberAction, removeMember } from '../actions'

function* onRemoveMemberAction({ payload: { roomId, address } }: ReturnType<typeof removeMember>) {
    try {
        yield call(web3PreflightSaga)

        const client: StreamrClient = yield call(getWalletClientSaga)

        yield client.setPermissions({
            streamId: roomId,
            assignments: [
                {
                    user: address,
                    permissions: [],
                },
            ],
        })

        yield put(detectMembers(roomId))
    } catch (e) {
        handleError(e)
    }
}

export default function* removeMemberSaga() {
    yield takeEvery(MemberAction.RemoveMember, onRemoveMemberAction)
}
