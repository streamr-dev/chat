import { MemberAction } from '$/features/member'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { Address, EnhancedStream } from '$/types'
import getStreamMetadata from '$/utils/getStreamMetadata'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error, success } from '$/utils/toaster'
import { put } from 'redux-saga/effects'

function* onTokenGatedPromoteDelegatedAccountAction({
    payload: { roomId, delegatedAddress, provider, streamrClient },
}: ReturnType<typeof MemberAction.promoteDelegatedAccount>) {
    try {
        const requester: Address = yield streamrClient.getAddress()

        const stream: EnhancedStream = yield streamrClient.getStream(roomId)
        const { tokenAddress } = getStreamMetadata(stream)

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

        success('Delegated account has been promoted on the TokenGated room.')
    } catch (e) {
        handleError(e)

        error('Failed to promote the delegated account.')
    }
}

export default function* tokenGatedPromoteDelegatedAccount() {
    yield takeEveryUnique(
        MemberAction.tokenGatedPromoteDelegatedAccount,
        onTokenGatedPromoteDelegatedAccountAction
    )
}
