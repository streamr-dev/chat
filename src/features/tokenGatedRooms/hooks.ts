import { selectTokenMetadata } from '$/features/tokenGatedRooms/selectors'
import { useSelector } from 'react-redux'

export function useGetTokenMetadata() {
    return useSelector(selectTokenMetadata())
}
