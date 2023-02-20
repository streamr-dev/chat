import Id from '$/components/Id'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import retrieve from '$/features/delegation/helpers/retrieve'
import { selectDelegatedAccount } from '$/features/delegation/selectors'
import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { RoomAction } from '$/features/room'
import { IRoom } from '$/features/room/types'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { Address, OptionalAddress } from '$/types'
import db from '$/utils/db'
import getRoomMetadata from '$/utils/getRoomMetadata'
import getUserPermissions from '$/utils/getUserPermissions'
import handleError from '$/utils/handleError'
import { error, loading } from '$/utils/toaster'
import { Id as ToastId, toast } from 'react-toastify'
import { call, put, select } from 'redux-saga/effects'
import { Stream } from 'streamr-client'

export default function pin({
    roomId,
    requester,
    streamrClient,
    provider,
}: ReturnType<typeof RoomAction.pin>['payload']) {
    return call(function* () {
        let toastId: ToastId | undefined

        let retrievedAccess = false

        try {
            yield put(FlagAction.set(Flag.isRoomBeingPinned()))

            toastId = loading(
                <>
                    Pinning <Id>{roomId}</Id>…
                </>
            )

            const owner = requester.toLowerCase()

            const stream: null | Stream = yield streamrClient.getStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const {
                createdAt,
                createdBy,
                tokenAddress,
                tokenType,
                stakingEnabled,
                name = '',
            } = getRoomMetadata(stream)

            const isTokenGated = !!tokenAddress

            let delegatedAccount: OptionalAddress = yield select(selectDelegatedAccount)

            if (tokenAddress && tokenType) {
                if (!delegatedAccount) {
                    retrievedAccess = true

                    yield put(FlagAction.set(Flag.isAccessBeingDelegated(requester)))

                    delegatedAccount = (yield retrieve({ provider, owner })) as Address
                }

                yield put(
                    TokenGatedRoomAction.join({
                        roomId,
                        tokenAddress,
                        provider,
                        stakingEnabled: stakingEnabled || false,
                        tokenType,
                    })
                )
            }

            const room: undefined | IRoom = yield db.rooms.where({ id: stream.id, owner }).first()

            const [permissions, isPublic]: Awaited<ReturnType<typeof getUserPermissions>> =
                yield getUserPermissions(owner, stream)

            if (permissions.length) {
                error('Pinning is redundant. You should already have the room on your list.')
                return
            }

            if (!isPublic && !isTokenGated) {
                error("You can't pin private rooms.")
                return
            }

            if (room) {
                yield db.rooms.where({ owner, id: roomId }).modify({ pinned: true, hidden: false })
            } else {
                yield db.rooms.add({
                    createdAt,
                    createdBy,
                    id: stream.id,
                    name,
                    owner,
                    pinned: true,
                })
            }

            yield put(MiscAction.goto(roomId))
        } catch (e) {
            handleError(e)

            error('Pinning failed.')
        } finally {
            if (toastId) {
                toast.dismiss(toastId)
            }

            if (retrievedAccess) {
                yield put(FlagAction.unset(Flag.isAccessBeingDelegated(requester)))
            }

            yield put(FlagAction.unset(Flag.isRoomBeingPinned()))
        }
    })
}
