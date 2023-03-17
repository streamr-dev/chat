import { Address, OptionalAddress, State } from '$/types'
import { useSelector } from 'react-redux'

export function tokenMetadataCacheKey(tokenAddress: Address, tokenIds: string[]) {
    return [tokenAddress.toLowerCase(), ...[...tokenIds].sort()]
}

export function selectTokenMetadata(tokenAddress: OptionalAddress, tokenIds: string[]) {
    if (!tokenAddress) {
        return () => undefined
    }

    return ({ misc }: State) =>
        misc.tokenMetadatas[JSON.stringify(tokenMetadataCacheKey(tokenAddress, tokenIds))]
}

export default function useTokenMetadata(tokenAddress: OptionalAddress, tokenIds: string[]) {
    return useSelector(selectTokenMetadata(tokenAddress, tokenIds))
}
