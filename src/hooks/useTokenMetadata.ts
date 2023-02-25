import { OptionalAddress, State } from '$/types'
import { useSelector } from 'react-redux'

function selectTokenMetadata(tokenAddress: OptionalAddress) {
    return ({ misc }: State) =>
        tokenAddress ? misc.tokenMetadatas[tokenAddress.toLowerCase()] : undefined
}

export default function useTokenMetadata(tokenAddress: OptionalAddress) {
    return useSelector(selectTokenMetadata(tokenAddress))
}
