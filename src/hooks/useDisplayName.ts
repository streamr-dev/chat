import useENSName from '$/hooks/useENSName'
import { Address } from '$/types'
import trunc from '$/utils/trunc'

export default function useDisplayName(address: Address) {
    const ensName = useENSName(address)

    return ensName || trunc(address)
}
