import { abi as ERC20abi } from '$/contracts/tokens/ERC20Token.sol/ERC20.json'
import { abi as ERC721abi } from '$/contracts/tokens/ERC721Token.sol/ERC721.json'
import { abi as ERC777abi } from '$/contracts/tokens/ERC777Token.sol/ERC777.json'
import { abi as ERC1155abi } from '$/contracts/tokens/ERC1155Token.sol/ERC1155.json'
import { BigNumber, Contract, providers } from 'ethers'
import { Address } from '$/types'
import { Erc1155, Erc20, Erc721, Erc777 } from '$/types'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { MiscAction } from '$/features/misc'
import { call } from 'redux-saga/effects'
import { JSON_RPC_URL } from '$/consts'
import { JsonRpcProvider } from '@ethersproject/providers'

function getURIs(tokenIds: string[], contract: Contract) {
    return call(function* () {
        const uris: Record<string, string> = {}

        yield call(function* () {
            for (let i = 0; i < tokenIds.length; i++) {
                const tokenId = tokenIds[i]

                uris[tokenId] = yield contract.tokenURI(BigNumber.from(tokenId))
            }
        })

        return uris
    })
}

function fetchERC20TokenMetadata(tokenAddress: Address, provider: JsonRpcProvider) {
    return call(function* () {
        const contract = new Contract(tokenAddress, ERC20abi, provider)

        const result: Erc20 = yield call(function* () {
            return {
                name: yield contract.name(),
                symbol: yield contract.symbol(),
                decimals: yield contract.decimals(),
            } as Erc20
        })

        return result
    })
}

function fetchERC721TokenMetadata(
    tokenAddress: Address,
    provider: JsonRpcProvider,
    tokenIds: string[]
) {
    return call(function* () {
        const contract = new Contract(tokenAddress, ERC721abi, provider)

        const result: Erc721 = yield call(function* () {
            return {
                name: yield contract.name(),
                symbol: yield contract.symbol(),
                uris: yield getURIs(tokenIds, contract),
            } as Erc721
        })

        return result
    })
}

function fetchERC777TokenMetadata(tokenAddress: Address, provider: JsonRpcProvider) {
    return call(function* () {
        const contract = new Contract(tokenAddress, ERC777abi, provider)

        const result: Erc777 = yield call(function* () {
            return {
                name: yield contract.name(),
                symbol: yield contract.symbol(),
                granularity: yield contract.granularity(),
            } as Erc777
        })

        return result
    })
}

function fetchERC1155TokenMetadata(
    tokenAddress: Address,
    provider: JsonRpcProvider,
    tokenIds: string[]
) {
    return call(function* () {
        const contract = new Contract(tokenAddress, ERC1155abi, provider)

        const result: Erc1155 = yield call(function* () {
            return {
                uris: yield getURIs(tokenIds, contract),
            } as Erc1155
        })

        return result
    })
}

export default function fetchTokenMetadata({
    tokenAddress,
    tokenIds,
    tokenStandard,
}: ReturnType<typeof MiscAction.fetchTokenMetadata>['payload']) {
    const provider = new providers.JsonRpcProvider(JSON_RPC_URL)

    switch (tokenStandard) {
        case TokenStandard.ERC1155:
            return fetchERC1155TokenMetadata(tokenAddress, provider, tokenIds)
        case TokenStandard.ERC20:
            return fetchERC20TokenMetadata(tokenAddress, provider)
        case TokenStandard.ERC721:
            return fetchERC721TokenMetadata(tokenAddress, provider, tokenIds)
        case TokenStandard.ERC777:
            return fetchERC777TokenMetadata(tokenAddress, provider)
        default:
            throw new Error(`Unsupported token standard: ${tokenStandard}`)
    }
}
