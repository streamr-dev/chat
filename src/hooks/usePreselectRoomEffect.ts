import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { RoomAction } from '$/features/room'
import { RoomId } from '$/features/room/types'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import { OptionalAddress } from '$/types'
import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function usePreselectRoomEffect() {
    const account = useWalletAccount()

    const dispatch = useDispatch()

    const streamrClient = useWalletClient()

    const { pathname } = useLocation()

    const lastPreselectRef = useRef<undefined | [OptionalAddress, RoomId]>(undefined)

    useEffect(() => {
        if (!streamrClient) {
            return
        }

        const partials = pathnameToRoomIdPartials(pathname)

        const roomId =
            typeof partials === 'string'
                ? partials
                : `${partials.account}/streamr-chat/room/${partials.uuid}`

        const { current: lastPreselect } = lastPreselectRef

        if (lastPreselect && lastPreselect[0] === account && lastPreselect[1] === roomId) {
            // Avoid preselecting the same thing twice.
            return
        }

        lastPreselectRef.current = [account, roomId]

        dispatch(
            RoomAction.preselect({
                account,
                roomId,
                streamrClient,
            })
        )

        dispatch(FlagAction.unset(Flag.isDisplayingRooms()))
    }, [account, dispatch, pathname, streamrClient])
}
