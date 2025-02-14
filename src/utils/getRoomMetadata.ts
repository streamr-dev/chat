import { IRoom } from '$/features/room/types'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import type { Stream } from '@streamr/sdk'
import { z } from 'zod'

export interface RoomMetadata
    extends Omit<IRoom, 'id' | 'name' | 'owner' | 'hidden' | 'pinned' | 'recentMessageAt'> {
    name?: string
}

export default async function getRoomMetadata(stream: Stream): Promise<RoomMetadata> {
    const { description: name, extensions } = parseStreamMetadata(await stream.getMetadata())

    const { ['thechat.eth']: chatExtension } = extensions

    return {
        ...chatExtension,
        name,
    }
}

function parseStreamMetadata(content: unknown) {
    return z
        .object({
            description: z.string().optional(),
            extensions: z
                .object({
                    'thechat.eth': RoomMetadata.passthrough().optional().default({}),
                })
                .optional()
                .default({}),
        })
        .parse(content)
}

const RoomMetadata = z.object({
    createdBy: z.string().optional(),
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
    tokenType: z
        .object({
            standard: z.nativeEnum(TokenStandard),
            isCountable: z.boolean(),
            hasIds: z.boolean(),
        })
        .optional(),
    tokenAddress: z.string().optional(),
    tokenIds: z.array(z.string()).optional(),
    minRequiredBalance: z.string().optional(),
    stakingEnabled: z.boolean().optional(),
})
