import { MemberAction } from '$/features/member'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { Address, EnhancedStream } from '$/types'
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
        const { tokenAddress, tokenType, tokenId } = stream.extensions['thechat.eth']

        if (!tokenAddress) {
            throw new Error('No token address found')
        }

        if (!tokenType) {
            throw new Error('No token type found')
        }

        yield put(
            TokenGatedRoomAction.join({
                roomId,
                owner: requester,
                tokenAddress: tokenAddress,
                provider,
                delegatedAccount: delegatedAddress,
                tokenType,
                tokenId,
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
