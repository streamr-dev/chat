import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectAnonAccount(state: State) {
    return state.anon.wallet?.address
}

export default function useAnonAccount() {
    return useSelector(selectAnonAccount)
}
