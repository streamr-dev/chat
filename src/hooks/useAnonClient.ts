import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectAnonClient(state: State) {
    return state.anon.client
}

export default function useAnonClient() {
    return useSelector(selectAnonClient)
}
