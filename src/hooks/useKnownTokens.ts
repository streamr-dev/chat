import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectKnownTokens(state: State) {
    return state.misc.knownTokens
}

export default function useKnownTokens() {
    return useSelector(selectKnownTokens)
}
