import { abi as ERC20abi } from '$/contracts/tokens/ERC20Token.sol/ERC20.json'
import { abi as ERC721abi } from '$/contracts/tokens/ERC721Token.sol/ERC721.json'
import { abi as ERC777abi } from '$/contracts/tokens/ERC777Token.sol/ERC777.json'
import { abi as ERC1155abi } from '$/contracts/tokens/ERC1155Token.sol/ERC1155.json'
import { BigNumber, Contract, providers } from 'ethers'
import { Address } from '$/types'
import { Provider } from '@web3-react/types'
import { Erc1155, Erc20, Erc721, Erc777 } from '$/types'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { MiscAction } from '$/features/misc'
import getWalletProvider from '$/utils/getWalletProvider'

function* getURIs(tokenIds: string[], contract: Contract) {
    const uris: Record<string, string> = {}

    for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i]

        uris[tokenId] = yield contract.tokenURI(BigNumber.from(tokenId))
    }

    return uris
}

function* fetchERC20TokenMetadata(tokenAddress: Address, provider: Provider) {
    const contract = new Contract(
        tokenAddress,
        ERC20abi,
        new providers.Web3Provider(provider).getSigner()
    )

    return {
        name: yield contract.name(),
        symbol: yield contract.symbol(),
        decimals: yield contract.decimals(),
    } as Erc20
}

function* fetchERC721TokenMetadata(tokenAddress: Address, provider: Provider, tokenIds: string[]) {
    const contract = new Contract(
        tokenAddress,
        ERC721abi,
        new providers.Web3Provider(provider).getSigner()
    )

    return {
        name: yield contract.name(),
        symbol: yield contract.symbol(),
        uris: yield getURIs(tokenIds, contract),
    } as Erc721
}

function* fetchERC777TokenMetadata(tokenAddress: Address, provider: Provider) {
    const contract = new Contract(
        tokenAddress,
        ERC777abi,
        new providers.Web3Provider(provider).getSigner()
    )

    return {
        name: yield contract.name(),
        symbol: yield contract.symbol(),
        granularity: yield contract.granularity(),
    } as Erc777
}

function* fetchERC1155TokenMetadata(tokenAddress: Address, provider: Provider, tokenIds: string[]) {
    const contract = new Contract(
        tokenAddress,
        ERC1155abi,
        new providers.Web3Provider(provider).getSigner()
    )

    return {
        uris: yield getURIs(tokenIds, contract),
    } as Erc1155
}

export default function* fetchTokenMetadata({
    tokenAddress,
    tokenIds,
    tokenStandard,
}: ReturnType<typeof MiscAction.fetchTokenMetadata>['payload']) {
    const provider = yield* getWalletProvider()

    switch (tokenStandard) {
        case TokenStandard.ERC1155:
            return yield* fetchERC1155TokenMetadata(tokenAddress, provider, tokenIds)
        case TokenStandard.ERC20:
            return yield* fetchERC20TokenMetadata(tokenAddress, provider)
        case TokenStandard.ERC721:
            return yield* fetchERC721TokenMetadata(tokenAddress, provider, tokenIds)
        case TokenStandard.ERC777:
            return yield* fetchERC777TokenMetadata(tokenAddress, provider)
        default:
            throw new Error('Not implemented')
    }
}
