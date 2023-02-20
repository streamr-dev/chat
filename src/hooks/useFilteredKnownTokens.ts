import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectFilteredKnownTokens(state: State) {
    return state.misc.filteredKnownTokens
}

export default function useFilteredKnownTokens() {
    return useSelector(selectFilteredKnownTokens)
}
