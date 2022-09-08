import { BigNumber } from 'ethers'

import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { put, takeEvery } from 'redux-saga/effects'
import { TokenTypes } from '$/features/tokenGatedRooms/types'

import { Contract, providers } from 'ethers'

import * as ERC20 from '../../../contracts/ERC20JoinPolicy.sol/TestERC20.json'
import * as ERC721 from '../../../contracts/ERC721JoinPolicy.sol/TestERC721.json'

import { Provider } from '@web3-react/types'
import { Address } from '$/types'

export const getERC20 = (address: Address, rawProvider: Provider): Contract => {
    return new Contract(address, ERC20.abi, new providers.Web3Provider(rawProvider).getSigner())
}

export const getERC721 = (address: Address, rawProvider: Provider): Contract => {
    return new Contract(address, ERC721.abi, new providers.Web3Provider(rawProvider).getSigner())
}

async function fetchMetadata(tokenUri: string) {
    try {
        const response = await fetch(tokenUri)
        const data = await response.json()
        return data
    } catch (e) {
        return {}
    }
}

function* onGetTokenMetadata({
    payload: { tokenAddress, tokenType, tokenId, provider },
}: ReturnType<typeof TokenGatedRoomAction.getTokenMetadata>) {
    try {
        let instance: Contract
        let name: string
        let symbol: string
        let decimals: BigNumber
        let tokenUri: string
        let fetchedMetadata: { [key: string]: string }

        switch (tokenType.standard) {
            case TokenTypes.ERC20.standard:
                instance = getERC20(tokenAddress, provider)
                name = yield instance.name()
                symbol = yield instance.symbol()
                decimals = yield instance.decimals()

                yield put(
                    TokenGatedRoomAction.setERC20Metadata({
                        contractAddress: tokenAddress,
                        name,
                        symbol,
                        decimals: decimals.toNumber(),
                    })
                )
                break
            case TokenTypes.ERC721.standard:
                if (!tokenId) {
                    throw new Error('tokenId is required for ERC721')
                }
                instance = getERC721(tokenAddress, provider)
                name = yield instance.name()
                symbol = yield instance.symbol()

                tokenUri = yield instance.tokenURI(tokenId)
                fetchedMetadata = yield fetchMetadata(tokenUri)

                yield put(
                    TokenGatedRoomAction.setERC721Metadata({
                        contractAddress: tokenAddress,
                        name,
                        symbol,
                        tokenId,
                        tokenUri,
                        fetchedMetadata,
                    })
                )

                break
            default:
                throw new Error(`Unsupported token type: ${tokenType.standard}`)
        }
    } catch (e) {
        console.error(e)
    }
}

export default function* getTokenMetadata() {
    yield takeEvery(TokenGatedRoomAction.getTokenMetadata, onGetTokenMetadata)
}
