import { BigNumber, Contract, providers } from 'ethers'

import { Provider } from '@web3-react/types'
import { Address } from '$/types'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { put, takeEvery } from 'redux-saga/effects'
import { TokenMetadata, TokenTypes } from '$/features/tokenGatedRooms/types'
import handleError from '$/utils/handleError'

import * as ERC20 from '../../../contracts/tokens/ERC20Token.sol/ERC20.json'
import * as ERC721 from '../../../contracts/tokens/ERC721Token.sol/ERC721.json'
import * as ERC777 from '../../../contracts/tokens/ERC777Token.sol/ERC777.json'
import * as ERC1155 from '../../../contracts/tokens/ERC1155Token.sol/ERC1155.json'

export const getERC20 = (address: Address, rawProvider: Provider): Contract => {
    return new Contract(address, ERC20.abi, new providers.Web3Provider(rawProvider).getSigner())
}

export const getERC721 = (address: Address, rawProvider: Provider): Contract => {
    return new Contract(address, ERC721.abi, new providers.Web3Provider(rawProvider).getSigner())
}

export const getERC777 = (address: Address, rawProvider: Provider): Contract => {
    return new Contract(address, ERC777.abi, new providers.Web3Provider(rawProvider).getSigner())
}

export const getERC1155 = (address: Address, rawProvider: Provider): Contract => {
    return new Contract(address, ERC1155.abi, new providers.Web3Provider(rawProvider).getSigner())
}

async function getERC20TokenMetadata(tokenAddress: Address, provider: Provider) {
    const instance = getERC20(tokenAddress, provider)

    return {
        name: await instance.name(),
        symbol: await instance.symbol(),
        decimals: BigNumber.from(await instance.decimals()),
    }
}

async function getERC721TokenMetadata(tokenAddress: Address, provider: Provider, tokenId: string) {
    const instance = getERC721(tokenAddress, provider)

    return {
        name: await instance.name(),
        symbol: await instance.symbol(),
        uri: await instance.tokenURI(BigNumber.from(tokenId)),
    }
}

async function getERC777TokenMetadata(tokenAddress: Address, provider: Provider) {
    const instance = getERC777(tokenAddress, provider)

    return {
        name: await instance.name(),
        symbol: await instance.symbol(),
        granularity: BigNumber.from(await instance.granularity()),
    }
}

async function getERC1155TokenMetadata(tokenAddress: Address, provider: Provider, tokenId: string) {
    const instance = getERC1155(tokenAddress, provider)

    return {
        uri: await instance.uri(BigNumber.from(tokenId)),
    }
}

function* onGetTokenMetadata({
    payload: { tokenAddress, tokenId, tokenType, provider },
}: ReturnType<typeof TokenGatedRoomAction.getTokenMetadata>) {
    try {
        let metadata: TokenMetadata

        switch (tokenType.standard) {
            case TokenTypes.ERC20.standard:
                metadata = yield getERC20TokenMetadata(tokenAddress, provider)
                break
            case TokenTypes.ERC721.standard:
                if (!tokenId) {
                    throw new Error('Token ID is required for ERC721 tokens')
                }
                metadata = yield getERC721TokenMetadata(tokenAddress, provider, tokenId)
                break
            case TokenTypes.ERC777.standard:
                metadata = yield getERC777TokenMetadata(tokenAddress, provider)
                break
            case TokenTypes.ERC1155.standard:
                if (!tokenId) {
                    throw new Error('Token ID is required for ERC1155 tokens')
                }
                metadata = yield getERC1155TokenMetadata(tokenAddress, provider, tokenId)
                break
            default:
                throw new Error(`Unsupported token type: ${tokenType.standard}`)
        }

        yield put(
            TokenGatedRoomAction.setTokenMetadata({
                name: metadata.name,
                symbol: metadata.symbol,
                decimals: metadata.decimals?.toString(),
                granularity: metadata.granularity?.toString(),
                uri: metadata.uri,
            })
        )
    } catch (e) {
        handleError(e)
    }
}

export default function* getTokenMetadata() {
    yield takeEvery(TokenGatedRoomAction.getTokenMetadata, onGetTokenMetadata)
}
