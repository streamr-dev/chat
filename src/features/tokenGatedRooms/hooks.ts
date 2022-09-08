import { selectERC20Metadata, selectERC721Metadata } from '$/features/tokenGatedRooms/selectors'
import { useSelector } from 'react-redux'

export function useGetERC20Metadata() {
    return useSelector(selectERC20Metadata())
}

export function useGetERC721Metadata() {
    return useSelector(selectERC721Metadata())
}
