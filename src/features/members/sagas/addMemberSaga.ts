import { takeEvery } from "redux-saga/effects";
import { addMember, MemberAction } from "../actions";

// eslint-disable-next-line @typescript-eslint/no-empty-function
function* onAddMemberAction({ payload: [roomId, address] }: ReturnType<typeof addMember>) {
}

export default function* addMemberSaga() {
    yield takeEvery(MemberAction.AddMember, onAddMemberAction)
}
