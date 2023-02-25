import { OptionalAddress, State } from '$/types'
import { useSelector } from 'react-redux'

function selectTokenInfo(tokenAddress: OptionalAddress) {
    if (!tokenAddress) {
        return () => undefined
    }

    return ({ misc }: State) => misc.knownTokensByAddress[tokenAddress.toLowerCase()]
}

export default function useTokenInfo(tokenAddress: OptionalAddress) {
    return useSelector(selectTokenInfo(tokenAddress))
}
