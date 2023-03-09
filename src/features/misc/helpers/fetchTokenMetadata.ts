import { abi as ERC20abi } from '$/contracts/tokens/ERC20Token.sol/ERC20.json'
import { abi as ERC721abi } from '$/contracts/tokens/ERC721Token.sol/ERC721.json'
import { abi as ERC777abi } from '$/contracts/tokens/ERC777Token.sol/ERC777.json'
import { abi as ERC1155abi } from '$/contracts/tokens/ERC1155Token.sol/ERC1155.json'
import { BigNumber, Contract, providers } from 'ethers'
import { Address, TokenMetadata } from '$/types'
import { Provider } from '@web3-react/types'
import { Erc1155, Erc20, Erc721, Erc777 } from '$/types'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { MiscAction } from '$/features/misc'
import getWalletProvider from '$/utils/getWalletProvider'
import { call } from 'redux-saga/effects'

function* getURIs(tokenIds: string[], contract: Contract) {
    const uris: Record<string, string> = {}

    yield call(function* () {
        for (let i = 0; i < tokenIds.length; i++) {
            const tokenId = tokenIds[i]

            uris[tokenId] = yield contract.tokenURI(BigNumber.from(tokenId))
        }
    })

    return uris
}

function* fetchERC20TokenMetadata(tokenAddress: Address, provider: Provider) {
    const contract = new Contract(
        tokenAddress,
        ERC20abi,
        new providers.Web3Provider(provider).getSigner()
    )

    const result: Erc20 = yield call(function* () {
        return {
            name: yield contract.name(),
            symbol: yield contract.symbol(),
            decimals: yield contract.decimals(),
        } as Erc20
    })

    return result
}

function* fetchERC721TokenMetadata(tokenAddress: Address, provider: Provider, tokenIds: string[]) {
    const contract = new Contract(
        tokenAddress,
        ERC721abi,
        new providers.Web3Provider(provider).getSigner()
    )

    const result: Erc721 = yield call(function* () {
        return {
            name: yield contract.name(),
            symbol: yield contract.symbol(),
            uris: yield getURIs(tokenIds, contract),
        } as Erc721
    })

    return result
}

function* fetchERC777TokenMetadata(tokenAddress: Address, provider: Provider) {
    const contract = new Contract(
        tokenAddress,
        ERC777abi,
        new providers.Web3Provider(provider).getSigner()
    )

    const result: Erc777 = yield call(function* () {
        return {
            name: yield contract.name(),
            symbol: yield contract.symbol(),
            granularity: yield contract.granularity(),
        } as Erc777
    })

    return result
}

function* fetchERC1155TokenMetadata(tokenAddress: Address, provider: Provider, tokenIds: string[]) {
    const contract = new Contract(
        tokenAddress,
        ERC1155abi,
        new providers.Web3Provider(provider).getSigner()
    )

    const result: Erc1155 = yield call(function* () {
        return {
            uris: yield getURIs(tokenIds, contract),
        } as Erc1155
    })

    return result
}

export default function* fetchTokenMetadata({
    tokenAddress,
    tokenIds,
    tokenStandard,
}: ReturnType<typeof MiscAction.fetchTokenMetadata>['payload']) {
    let metadata: TokenMetadata | undefined

    yield call(function* () {
        const provider = yield* getWalletProvider()

        switch (tokenStandard) {
            case TokenStandard.ERC1155:
                metadata = yield* fetchERC1155TokenMetadata(tokenAddress, provider, tokenIds)
                break
            case TokenStandard.ERC20:
                metadata = yield* fetchERC20TokenMetadata(tokenAddress, provider)
                break
            case TokenStandard.ERC721:
                metadata = yield* fetchERC721TokenMetadata(tokenAddress, provider, tokenIds)
                break
            case TokenStandard.ERC777:
                metadata = yield* fetchERC777TokenMetadata(tokenAddress, provider)
                break
        }
    })

    if (!metadata) {
        throw new Error('Invalid metadata')
    }

    return metadata
}
