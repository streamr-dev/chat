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

async function getURIs(tokenIds: string[], contract: Contract) {
    const uris: Record<string, string> = {}

    for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i]

        uris[tokenId] = await contract.tokenURI(BigNumber.from(tokenId))
    }

    return uris
}

async function fetchERC20TokenMetadata(tokenAddress: Address, provider: Provider): Promise<Erc20> {
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

async function fetchERC721TokenMetadata(
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

async function fetchERC777TokenMetadata(
    tokenAddress: Address,
    provider: Provider
): Promise<Erc777> {
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

async function fetchERC1155TokenMetadata(
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

export default function fetchTokenMetadata({
    tokenAddress,
    tokenIds,
    tokenStandard,
    provider,
}: ReturnType<typeof MiscAction.fetchTokenMetadata>['payload']) {
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
            throw new Error('Not implemented')
    }
}
