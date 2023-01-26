import { RoomAction } from '$/features/room'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function usePreselectRoomEffect() {
    const account = useWalletAccount()

    const dispatch = useDispatch()

    const streamrClient = useWalletClient()

    const { pathname } = useLocation()

    useEffect(() => {
        if (!streamrClient) {
            return
        }

        dispatch(
            RoomAction.preselect({
                account,
                roomId: pathname.replace(/^\//, ''),
                streamrClient,
            })
        )
    }, [account, dispatch, pathname, streamrClient])
}
