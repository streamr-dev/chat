import useAlias from '$/hooks/useAlias'
import useENSName from '$/hooks/useENSName'
import { OptionalAddress } from '$/types'
import trunc from '$/utils/trunc'

interface Options {
    fallback?: string
}

export default function useDisplayUsername(
    address: OptionalAddress,
    { fallback = '' }: Options = {}
) {
    const alias = useAlias(address)

    const ensName = useENSName(address)

    return alias || ensName || (address ? trunc(address) : fallback)
}
