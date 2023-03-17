import { Flag } from '$/features/flag/types'
import { RoomAction } from '$/features/room'
import { useWalletAccount } from '$/features/wallet/hooks'
import { Prefix } from '$/types'
import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function usePreselectRoomEffect() {
    const account = useWalletAccount()

    const dispatch = useDispatch()

    const { pathname } = useLocation()

    const pathnameRef = useRef(pathname)

    useEffect(() => {
        pathnameRef.current = pathname
    }, [pathname])

    useEffect(() => {
        if (!account) {
            return
        }

        const partials = pathnameToRoomIdPartials(pathnameRef.current)

        const roomId =
            typeof partials === 'string'
                ? partials
                : `${partials.account}/${Prefix.Room}/${partials.uuid}`

        dispatch(
            RoomAction.preselect({
                account,
                roomId,
                fingerprint: Flag.isPreselectingRoom(roomId),
            })
        )
    }, [account, dispatch])
}
