import { selectERC20Metadata } from '$/features/tokenGatedRooms/selectors'
import { useSelector } from 'react-redux'

export function useGetERC20Metadata() {
    return useSelector(selectERC20Metadata())
}
