import { createContext, useCallback, useContext } from 'react'
import useInviter from '../../../hooks/useInviter'
import { MessageType, Partition } from '../../../utils/types'
import { useStore } from '../../Store'
import { v4 as uuidv4 } from 'uuid'
import MessageAggregator from './MessageAggregator'
import useCreateRoom from '../../../hooks/useCreateRoom'
import useDeleteRoom from '../../../hooks/useDeleteRoom'
import { useRenameRoom } from './RoomRenameProvider'

type TransmitFn = (
    payload: string,
    options: { streamPartition?: number }
) => void

const TransmitContext = createContext<TransmitFn>(() => {})

type Props = {
    children?: React.ReactNode
}

export function useSend(): TransmitFn {
    return useContext(TransmitContext)
}

enum Command {
    Invite = 'invite',
    Delete = 'delete',
    New = 'new',
    Rename = 'rename',
}

export default function MessageTransmitter({ children }: Props) {
    const {
        account,
        roomId,
        session: { streamrClient },
    } = useStore()

    const invite = useInviter()

    const createRoom = useCreateRoom()

    const deleteRoom = useDeleteRoom()

    const renameRoom = useRenameRoom()

    const send = useCallback<TransmitFn>(
        async (payload, { streamPartition = Partition.Messages }) => {
            if (!account || !roomId || !streamrClient) {
                return
            }

            const [command, arg] = (
                payload.match(/\/(invite|delete|new|rename)\s*(.+)?\s*$/) || []
            ).slice(1)

            switch (command) {
                case Command.Rename:
                    if (!arg) {
                        return
                    }

                    await renameRoom(roomId, arg)

                    return
                case Command.Invite:
                    if (!arg) {
                        return
                    }

                    await (async () => {
                        const stream = await streamrClient.getStream(roomId)

                        await invite({
                            invitee: arg,
                            stream,
                        })
                    })()

                    return
                case Command.Delete:
                    await deleteRoom(roomId)
                    return
                case Command.New:
                    await createRoom()
                    return
                default:
                    break
            }

            await streamrClient.publish(
                roomId,
                {
                    body: payload,
                    createdAt: Date.now(),
                    id: uuidv4(),
                    sender: account,
                    type: MessageType.TEXT,
                    version: 1,
                },
                Date.now(),
                streamPartition
            )
        },
        [
            account,
            roomId,
            streamrClient,
            invite,
            createRoom,
            deleteRoom,
            renameRoom,
        ]
    )

    return (
        <TransmitContext.Provider value={send}>
            <MessageAggregator>{children}</MessageAggregator>
        </TransmitContext.Provider>
    )
}
