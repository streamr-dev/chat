import { Flag } from '$/features/flag/types'
import { RoomAction } from '$/features/room'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function usePreselectRoomEffect() {
    const account = useWalletAccount()

    const dispatch = useDispatch()

    const streamrClient = useWalletClient()

    const { pathname } = useLocation()

    const pathnameRef = useRef(pathname)

    useEffect(() => {
        pathnameRef.current = pathname
    }, [pathname])

    useEffect(() => {
        if (!streamrClient || !account) {
            return
        }

        const partials = pathnameToRoomIdPartials(pathnameRef.current)

        const roomId =
            typeof partials === 'string'
                ? partials
                : `${partials.account}/streamr-chat/room/${partials.uuid}`

        dispatch(
            RoomAction.preselect({
                account,
                roomId,
                streamrClient,
                fingerprint: Flag.isPreselectingRoom(roomId),
            })
        )
    }, [account, dispatch, streamrClient])
}
