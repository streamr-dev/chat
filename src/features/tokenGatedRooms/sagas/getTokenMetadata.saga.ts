import { BigNumber, Contract, providers } from 'ethers'

import { Provider } from '@web3-react/types'
import { Address } from '$/types'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { put, takeEvery } from 'redux-saga/effects'
import { TokenTypes } from '$/features/tokenGatedRooms/types'
import handleError from '$/utils/handleError'

import * as ERC20 from '../../../contracts/tokens/ERC20Token.sol/ERC20.json'

export const getERC20 = (address: Address, rawProvider: Provider): Contract => {
    return new Contract(address, ERC20.abi, new providers.Web3Provider(rawProvider).getSigner())
}
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
        handleError(e)
    }
}

export default function* getTokenMetadata() {
    yield takeEvery(TokenGatedRoomAction.getTokenMetadata, onGetTokenMetadata)
}
