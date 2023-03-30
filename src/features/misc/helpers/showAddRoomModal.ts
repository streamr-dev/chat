import AddRoomModal, { NewRoom } from '$/components/modals/AddRoomModal'
import AddTokenGatedRoomModal, { Gate } from '$/components/modals/AddTokenGatedRoomModal'
import { RoomAction } from '$/features/room'
import { TokenTypes } from '$/features/tokenGatedRooms/types'
import { selectWalletAccount } from '$/features/wallet/selectors'
import { OptionalAddress, Prefix, PrivacySetting } from '$/types'
import handleError from '$/utils/handleError'
import { toaster, Toaster } from 'toasterhea'
import { call, cancelled, put, select } from 'redux-saga/effects'
import { v4 as uuidv4 } from 'uuid'
import { Layer } from '$/consts'

let basic: Toaster<typeof AddRoomModal> | undefined

let tokenGated: Toaster<typeof AddTokenGatedRoomModal> | undefined

export default function showAddRoomModal() {
    return call(function* () {
        try {
            const account: OptionalAddress = yield select(selectWalletAccount)

            if (!account) {
                throw new Error('No account')
            }

            let lastParams: NewRoom = {
                name: '',
                storage: true,
                privacy: PrivacySetting.Private,
            }

            while (true) {
                try {
                    if (!basic) {
                        basic = toaster(AddRoomModal, Layer.Modal)
                    }

                    const params: NewRoom = yield basic.pop({
                        params: lastParams,
                    })

                    lastParams = params

                    if (params.privacy !== PrivacySetting.TokenGated) {
                        const now = Date.now()

                        yield put(
                            RoomAction.create({
                                params: {
                                    createdAt: now,
                                    createdBy: account,
                                    id: `/${Prefix.Room}/${uuidv4()}`,
                                    name: params.name,
                                    owner: account,
                                    updatedAt: now,
                                },
                                privacy: params.privacy,
                                storage: params.storage,
                                requester: account,
                            })
                        )

                        return
                    }

                    try {
                        if (!tokenGated) {
                            tokenGated = toaster(AddTokenGatedRoomModal, Layer.Modal)
                        }

                        const { standard, ...gate }: Gate = yield tokenGated.pop({
                            subtitle: params.name,
                        })

                        const now = Date.now()

                        const tokenType = TokenTypes[standard]

                        yield put(
                            RoomAction.create({
                                params: {
                                    createdAt: now,
                                    createdBy: account,
                                    id: `/${Prefix.Room}/${uuidv4()}`,
                                    name: params.name,
                                    owner: account,
                                    updatedAt: now,
                                    tokenType,
                                    ...gate,
                                },
                                privacy: params.privacy,
                                storage: params.storage,
                                requester: account,
                            })
                        )

                        break
                    } catch (e) {
                        // Do nothing. Let it loop back to the first modal.
                    }
                } catch (e) {
                    break
                }
            }
        } catch (e) {
            handleError(e)
        } finally {
            if (yield cancelled()) {
                basic?.discard()

                tokenGated?.discard()
            }
        }
    })
}
