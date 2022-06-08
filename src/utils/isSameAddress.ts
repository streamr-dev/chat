import { OptionalAddress } from '../../types/common'

export default function isSameAddress(
    addrA: OptionalAddress,
    addrB: OptionalAddress
): boolean {
    return (addrA || '').toLowerCase() === (addrB || '').toLowerCase()
}
