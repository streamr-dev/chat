import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectTokenMetadata(state: State) {
    return state.tokenGatedRooms.tokenMetadata
}

export default function useTokenMetadata() {
    return useSelector(selectTokenMetadata)
}
