import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient, { StreamPermission } from 'streamr-client'
import getWalletClientSaga from '../../../sagas/getWalletClientSaga'
import web3PreflightSaga from '../../../sagas/web3PreflightSaga'
import handleError from '../../../utils/handleError'
import { addMember, detectMembers, MemberAction } from '../actions'

function* onAddMemberAction({ payload: { roomId, address } }: ReturnType<typeof addMember>) {
    try {
        yield call(web3PreflightSaga)

        const client: StreamrClient = yield call(getWalletClientSaga)

        yield client.setPermissions({
            streamId: roomId,
            assignments: [
                {
                    user: address,
                    permissions: [
                        StreamPermission.GRANT,
                        StreamPermission.PUBLISH,
                        StreamPermission.SUBSCRIBE,
                    ],
                },
            ],
        })

        yield put(detectMembers(roomId))
    } catch (e) {
        handleError(e)
    }
}

export default function* addMemberSaga() {
    yield takeEvery(MemberAction.AddMember, onAddMemberAction)
}
