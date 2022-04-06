import { createContext, useCallback, useContext } from 'react'
import useInviter from '../../../hooks/useInviter'
import { MessageType, MetadataType, Partition } from '../../../utils/types'
import { useStore } from '../../Store'
import { v4 as uuidv4 } from 'uuid'
import MessageAggregator from './MessageAggregator'
import useCreateRoom from '../../../hooks/useCreateRoom'
import useDeleteRoom from '../../../hooks/useDeleteRoom'
import { useRenameRoom } from './RoomRenameProvider'
import { StreamPermission } from 'streamr-client'
import useRevoker from '../../../hooks/useRevoker'
import getRoomMembersFromStream from '../../../getters/getRoomMembersFromStream'
import { ROOM_PREFIX } from '../../../hooks/useExistingRooms'
import getRoomMetadata from '../../../getters/getRoomMetadata'

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
    Purge = 'purge',
    Export = 'export',
    Join = 'join',
}

export default function MessageTransmitter({ children }: Props) {
    const {
        metamaskStreamrClient,
        account,
        roomId,
        session: { streamrClient, wallet },
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
                    !metamaskStreamrClient ||
                    !wallet
                ) {
                    return
                }

                const [command, arg] = (
                    payload.match(
                        /\/(invite|delete|new|rename|members|revoke|isMember|purge|export|join)\s*(.+)?\s*$/
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
                        await createRoom({
                            roomName: arg,
                            privacy: 'private',
                        })
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
                    case Command.Purge:
                        const didConfirm = window.confirm(
                            `You are about to delete all your streams and reset your account:\n${account}\nAre you sure you want to continue?`
                        )

                        if (didConfirm) {
                            const streams =
                                metamaskStreamrClient!.searchStreams(
                                    ROOM_PREFIX,
                                    {
                                        user: account!,
                                        anyOf: [
                                            StreamPermission.GRANT,
                                            StreamPermission.SUBSCRIBE,
                                        ],
                                        allowPublic: true,
                                    }
                                )

                            for await (const stream of streams) {
                                try {
                                    await stream.revokePermissions({
                                        user: account!,
                                        permissions: [
                                            StreamPermission.GRANT,
                                            StreamPermission.SUBSCRIBE,
                                        ],
                                    })
                                    console.info(
                                        `revoked permissions for ${stream.id}`
                                    )
                                    await stream.delete()
                                    console.info(`deleted stream ${stream.id}`)
                                } catch (e) {
                                    console.warn(
                                        'Purge failed to delete stream, moving on',
                                        e
                                    )
                                }
                            }

                            localStorage.clear()
                            console.info('Purge finished, reloading page')

                            window.location.reload()
                        }

                        return
                    case Command.Export:
                        const { privateKey } = wallet
                        alert(
                            `This is your session's private key:\n${privateKey}`
                        )
                        return
                    case Command.Join:
                        return
                    default:
                        break
                }

                try {
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
                } catch (e: any) {
                    console.warn(`Failed to publish to stream ${roomId}`)
                }
                return
            }

            if (streamPartition === Partition.Metadata) {
                if (!account || !streamrClient || !streamId || !data) {
                    return
                }
                try {
                    const stream = await streamrClient.getStream(streamId)
                    const { privacy } = getRoomMetadata(stream.description!)
                    if (privacy === 'private') {
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
                } catch (e: any) {
                    console.warn(`Failed to publish to stream ${roomId}`)
                }
            }
        },
        [
            metamaskStreamrClient,
            account,
            roomId,
            streamrClient,
            wallet,
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
