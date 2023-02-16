import { ToastType } from '$/components/Toast'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import toast from '$/features/toaster/helpers/toast'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { Address } from '$/types'
import getRoomMetadata from '$/utils/getRoomMetadata'
import handleError from '$/utils/handleError'
import { call, put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'

export default function tokenGatedPromoteDelegatedAccount({
    roomId,
    delegatedAddress,
    provider,
    streamrClient,
}: ReturnType<typeof PermissionsAction.promoteDelegatedAccount>['payload']) {
    return call(function* () {
        try {
            const requester: Address = yield streamrClient.getAddress()

            const stream: null | Stream = yield streamrClient.getStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const { tokenAddress } = getRoomMetadata(stream)

            if (!tokenAddress) {
                throw new Error('No token address found')
            }

            yield put(
                TokenGatedRoomAction.joinERC20({
                    roomId,
                    owner: requester,
                    tokenAddress: tokenAddress,
                    provider,
                    delegatedAccount: delegatedAddress,
                })
            )

            yield toast({
                title: 'Delegated account has been promoted on the TokenGated room',
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast({
                title: 'Failed to promote the delegated account',
                type: ToastType.Error,
            })
        }
    })
}
