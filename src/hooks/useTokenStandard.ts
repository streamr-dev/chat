import { OptionalAddress, State } from '$/types'
import { useSelector } from 'react-redux'

export function selectTokenStandard(address: OptionalAddress) {
    return (state: State) => {
        if (!address) {
            return undefined
        }

        return state.misc.tokenStandards[address.toLowerCase()]
    }
}

export default function useTokenStandard(address: OptionalAddress) {
    return useSelector(selectTokenStandard(address))
}
