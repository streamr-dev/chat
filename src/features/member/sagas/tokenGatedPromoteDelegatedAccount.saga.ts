import { MemberAction } from '$/features/member'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { EnhancedStream } from '$/types'
import getStreamMetadata from '$/utils/getStreamMetadata'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error, success } from '$/utils/toaster'
import { put } from 'redux-saga/effects'

function* onTokenGatedPromoteDelegatedAccountAction({
    payload: { roomId, provider, streamrClient },
}: ReturnType<typeof MemberAction.tokenGatedPromoteDelegatedAccount>) {
    try {
        const stream: EnhancedStream = yield streamrClient.getStream(roomId)
        const { tokenAddress, tokenId, tokenType } = getStreamMetadata(stream)

        if (!tokenAddress || tokenId === undefined || !tokenType) {
            throw new Error(
                `Missing token info on stream metadata: ${JSON.stringify({
                    tokenAddress,
                    tokenId,
                    tokenType,
                })}`
            )
        }

        yield put(
            TokenGatedRoomAction.join({
                roomId,
                tokenAddress,
                provider,
                tokenId,
                tokenType,
                stakingEnabled: false,
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
