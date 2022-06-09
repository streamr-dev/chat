import { OptionalAddress } from '$/types'

export default function isSameAddress(addrA: OptionalAddress, addrB: OptionalAddress): boolean {
    return (addrA || '').toLowerCase() === (addrB || '').toLowerCase()
}
