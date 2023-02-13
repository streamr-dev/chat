import { RoomId } from '$/features/room/types'

interface Partials {
    account: string
    uuid: string
}

export default function pathnameToRoomIdPartials(pathname: string): RoomId | Partials {
    const ids = pathname.match(/^\/?(0x[a-f\d]{40})(?:~|\/streamr-chat\/room\/)([\w\d-]+)$/i)

    const [, account, uuid] = ids || []

    if (account && uuid) {
        return {
            account,
            uuid,
        }
    }

    return pathname.replace(/^\//, '')
}
