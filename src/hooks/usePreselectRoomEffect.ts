import { RoomAction } from '$/features/room'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
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

        const partials = pathnameToRoomIdPartials(pathname)

        dispatch(
            RoomAction.preselect({
                account,
                roomId:
                    typeof partials === 'string'
                        ? partials
                        : `${partials.account}/streamr-chat/room/${partials.uuid}`,
                streamrClient,
            })
        )
    }, [account, dispatch, pathname, streamrClient])
}
