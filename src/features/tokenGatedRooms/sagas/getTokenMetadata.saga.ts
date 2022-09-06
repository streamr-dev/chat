import { BigNumber } from 'ethers'

import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { put, takeEvery } from 'redux-saga/effects'
import { getERC20 } from '$/features/tokenGatedRooms/utils/getERC20'
import { TokenTypes } from '$/features/tokenGatedRooms/types'

function* onGetTokenMetadata({
    payload: { tokenAddress, tokenType, provider },
}: ReturnType<typeof TokenGatedRoomAction.getTokenMetadata>) {
    try {
        if (tokenType.standard !== TokenTypes.ERC20.standard) {
            throw new Error(`Unsupported token type: ${tokenType.standard}`)
        }
        const instance = getERC20(tokenAddress, provider)

        const name: string = yield instance.name()

        const symbol: string = yield instance.symbol()

        const decimals: BigNumber = yield instance.decimals()

        yield put(
            TokenGatedRoomAction.setERC20Metadata({
                name,
                symbol,
                decimals,
            })
        )
    } catch (e) {
        console.error(e)
    }
}

export default function* getTokenMetadata() {
    yield takeEvery(TokenGatedRoomAction.getTokenMetadata, onGetTokenMetadata)
}
