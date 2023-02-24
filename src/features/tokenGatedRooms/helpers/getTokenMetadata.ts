import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { abi as ERC20abi } from '$/contracts/tokens/ERC20Token.sol/ERC20.json'
import { abi as ERC721abi } from '$/contracts/tokens/ERC721Token.sol/ERC721.json'
import { abi as ERC777abi } from '$/contracts/tokens/ERC777Token.sol/ERC777.json'
import { abi as ERC1155abi } from '$/contracts/tokens/ERC1155Token.sol/ERC1155.json'
import { BigNumber, Contract, providers } from 'ethers'
import { Address } from '$/types'
import { Provider } from '@web3-react/types'
import { Erc1155, Erc20, Erc721, Erc777, TokenStandard } from '$/features/tokenGatedRooms/types'

async function getURIs(tokenIds: string[], contract: Contract) {
    if (tokenIds.length === 0) {
        throw new Error('Token id is required')
    }

    const uris: Record<string, string> = {}

    for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i]

        uris[tokenId] = await contract.tokenURI(BigNumber.from(tokenId))
    }

    return uris
}

async function getERC20TokenMetadata(tokenAddress: Address, provider: Provider): Promise<Erc20> {
    const contract = new Contract(
        tokenAddress,
        ERC20abi,
        new providers.Web3Provider(provider).getSigner()
    )

    return {
        name: await contract.name(),
        symbol: await contract.symbol(),
        decimals: await contract.decimals(),
    }
}

async function getERC721TokenMetadata(
    tokenAddress: Address,
    provider: Provider,
    tokenIds: string[]
): Promise<Erc721> {
    const contract = new Contract(
        tokenAddress,
        ERC721abi,
        new providers.Web3Provider(provider).getSigner()
    )

    return {
        name: await contract.name(),
        symbol: await contract.symbol(),
        uris: await getURIs(tokenIds, contract),
    }
}

async function getERC777TokenMetadata(tokenAddress: Address, provider: Provider): Promise<Erc777> {
    const contract = new Contract(
        tokenAddress,
        ERC777abi,
        new providers.Web3Provider(provider).getSigner()
    )

    return {
        name: await contract.name(),
        symbol: await contract.symbol(),
        granularity: await contract.granularity(),
    }
}

async function getERC1155TokenMetadata(
    tokenAddress: Address,
    provider: Provider,
    tokenIds: string[]
): Promise<Erc1155> {
    const contract = new Contract(
        tokenAddress,
        ERC1155abi,
        new providers.Web3Provider(provider).getSigner()
    )

    return {
        uris: await getURIs(tokenIds, contract),
    }
}

export default function getTokenMetadata({
    tokenAddress,
    tokenIds,
    tokenStandard,
    provider,
}: ReturnType<typeof TokenGatedRoomAction.getTokenMetadata>['payload']) {
    switch (tokenStandard) {
        case TokenStandard.ERC1155:
            return getERC1155TokenMetadata(tokenAddress, provider, tokenIds)
        case TokenStandard.ERC20:
            return getERC20TokenMetadata(tokenAddress, provider)
        case TokenStandard.ERC721:
            return getERC721TokenMetadata(tokenAddress, provider, tokenIds)
        case TokenStandard.ERC777:
            return getERC777TokenMetadata(tokenAddress, provider)
        default:
            throw new Error('Not implemented')
    }
}
