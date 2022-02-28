import { createContext, useCallback, useContext } from 'react'
import useInviter from '../../../hooks/useInviter'
import { MessageType, Partition } from '../../../utils/types'
import { useStore } from '../../Store'
import { v4 as uuidv4 } from 'uuid'
import MessageAggregator, { MetadataType } from './MessageAggregator'
import useCreateRoom from '../../../hooks/useCreateRoom'
import useDeleteRoom from '../../../hooks/useDeleteRoom'
import { useRenameRoom } from './RoomRenameProvider'
import { StreamPermission } from 'streamr-client'
import useRevoker from '../../../hooks/useRevoker'
import getRoomMembersFromStream from '../../../getters/getRoomMembersFromStream'

type TransmitFn = (
    payload: string,
    options: { streamPartition?: number; streamId?: string; data?: any }
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
    Members = 'members',
    Revoke = 'revoke',
    IsMember = 'isMember',
}

export default function MessageTransmitter({ children }: Props) {
    const {
        metamaskStreamrClient,
        account,
        roomId,
        session: { streamrClient },
    } = useStore()

    const invite = useInviter()

    const revoke = useRevoker()

    const createRoom = useCreateRoom()

    const deleteRoom = useDeleteRoom()

    const renameRoom = useRenameRoom()

    const send = useCallback<TransmitFn>(
        async (payload, { streamPartition, streamId, data }) => {
            if (streamPartition === Partition.Messages) {
                if (
                    !account ||
                    !roomId ||
                    !streamrClient ||
                    !metamaskStreamrClient
                ) {
                    return
                }

                const [command, arg] = (
                    payload.match(
                        /\/(invite|delete|new|rename|members|revoke|isMember)\s*(.+)?\s*$/
                    ) || []
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
                            const stream =
                                await metamaskStreamrClient.getStream(roomId)

                            const addresses = arg
                                .split(/[,\s]+/)
                                .filter(Boolean)

                            await invite({
                                invitees: addresses,
                                stream,
                            })

                            for (let i = 0; i < addresses.length; i++) {
                                const address = addresses[i]
                                send(MetadataType.SendInvite, {
                                    streamPartition: Partition.Metadata,
                                    streamId: roomId,
                                    data: address,
                                })
                            }
                        })()

                        return
                    case Command.Revoke:
                        if (!arg) {
                            return
                        }
                        await (async () => {
                            const stream =
                                await metamaskStreamrClient.getStream(roomId)

                            const addresses = arg
                                .split(/[,\s]+/)
                                .filter(Boolean)

                            for (let i = 0; i < addresses.length; i++) {
                                const address = addresses[i]

                                send(MetadataType.RevokeInvite, {
                                    streamPartition: Partition.Metadata,
                                    streamId: roomId,
                                    data: address,
                                })
                                await revoke({
                                    revokee: address,
                                    stream,
                                })
                            }
                        })()

                        return
                    case Command.Delete:
                        await deleteRoom(roomId)
                        return
                    case Command.New:
                        await createRoom(arg)
                        return
                    case Command.Members:
                        const stream = await streamrClient.getStream(roomId)
                        const members = await getRoomMembersFromStream(stream)
                        console.info(`room ${roomId} has members:`, members)
                        return
                    case Command.IsMember:
                        const isMemberStream = await streamrClient.getStream(
                            roomId
                        )
                        const permissions = await isMemberStream.hasPermission({
                            permission: StreamPermission.SUBSCRIBE,
                            user: arg,
                            allowPublic: true,
                        })
                        console.info(
                            `user ${arg} is member of room ${roomId}:`,
                            permissions
                        )
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
                        type: MessageType.Text,
                        version: 1,
                    },
                    Date.now(),
                    streamPartition
                )
                return
            }

            if (streamPartition === Partition.Metadata) {
                if (!account || !streamrClient || !streamId || !data) {
                    return
                }

                await streamrClient.publish(
                    streamId,
                    {
                        body: {
                            type: payload,
                            payload: data,
                        },
                        createdAt: Date.now(),
                        id: uuidv4(),
                        sender: account,
                        type: MessageType.Metadata,
                        version: 1,
                    },
                    Date.now(),
                    streamPartition
                )
            }
        },
        [
            metamaskStreamrClient,
            account,
            roomId,
            streamrClient,
            invite,
            createRoom,
            deleteRoom,
            renameRoom,
            revoke,
        ]
    )

    return (
        <TransmitContext.Provider value={send}>
            <MessageAggregator>{children}</MessageAggregator>
        </TransmitContext.Provider>
    )
}
