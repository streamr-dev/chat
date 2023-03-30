import AddMemberModal from '$/components/modals/AddMemberModal'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { PermissionsAction } from '$/features/permissions'
import { selectWalletAccount } from '$/features/wallet/selectors'
import { OptionalAddress } from '$/types'
import handleError from '$/utils/handleError'
import { toaster, Toaster } from 'toasterhea'
import { call, cancelled, put, select } from 'redux-saga/effects'
import { Layer } from '$/consts'

let modal: Toaster<typeof AddMemberModal> | undefined

export default function showAddMemberModal({
    roomId,
}: ReturnType<typeof MiscAction.showAddMemberModal>['payload']) {
    return call(function* () {
        try {
            const requester: OptionalAddress = yield select(selectWalletAccount)

            if (!requester) {
                throw new Error('No requester')
            }

            let member: OptionalAddress

            if (!modal) {
                modal = toaster(AddMemberModal, Layer.Modal)
            }

            try {
                member = yield modal.pop()
            } catch (e) {
                // Do nothing
            }

            if (!member) {
                return
            }

            yield put(
                PermissionsAction.addMember({
                    roomId,
                    member,
                    requester,
                    fingerprint: Flag.isMemberBeingAdded(roomId, member),
                })
            )
        } catch (e) {
            handleError(e)
        } finally {
            if (yield cancelled()) {
                modal?.discard()
            }
        }
    })
}
