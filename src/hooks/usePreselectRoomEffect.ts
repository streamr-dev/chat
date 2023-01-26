import { RoomAction } from '$/features/room'
import { useWalletAccount } from '$/features/wallet/hooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function usePreselectRoomEffect() {
    const account = useWalletAccount()

    const dispatch = useDispatch()

    const { pathname } = useLocation()

    useEffect(() => {
        dispatch(
            RoomAction.preselect({
                roomId: pathname.replace(/^\//, ''),
                account,
            })
        )
    }, [account, dispatch, pathname])
}
