import { MemberAction } from '$/features/member'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call } from 'redux-saga/effects'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import takeEveryUnique from '$/utils/takeEveryUnique'
import trunc from '$/utils/trunc'
import { IENSName } from '$/features/ens/types'
import db from '$/utils/db'

function* onRemoveAction({
    payload: { roomId, member, provider, requester, streamrClient },
}: ReturnType<typeof MemberAction.remove>) {
    let domain: undefined | string

    try {
        try {
            const ens: null | IENSName = yield db.ensNames
                .where({ address: member.toLowerCase() })
                .first()

            domain = ens?.content
        } catch (e) {
            // Ignore.
        }

        yield call(
            setMultiplePermissions,
            roomId,
            [
                {
                    user: member,
                    permissions: [],
                },
            ],
            {
                provider,
                requester,
                streamrClient,
            }
        )

        success(
            <>
                <strong>{domain || trunc(member)}</strong> has gotten removed.
            </>
        )
    } catch (e) {
        handleError(e)

        error(
            <>
                Failed to remove <strong>{domain || trunc(member)}</strong>.
            </>
        )
    }
}

export default function* remove() {
    yield takeEveryUnique(MemberAction.remove, onRemoveAction)
}
