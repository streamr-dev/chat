import { OptionalAddress, State } from '$/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

function selectFlags({ flag }: State) {
    return flag
}

export default function useFetchingTokenMetadataForAnyTokenId(tokenAddress: OptionalAddress) {
    const flags = useSelector(selectFlags)

    return useMemo(() => {
        if (!tokenAddress) {
            return false
        }

        return Object.keys(flags).some((flag) =>
            flag.startsWith(`["isFetchingTokenMetadata","${tokenAddress.toLowerCase()}"`)
        )
    }, [flags, tokenAddress])
}
