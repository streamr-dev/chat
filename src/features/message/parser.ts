import { z } from 'zod'

export function parseChatMessage(content: unknown) {
    return z
        .object({
            content: z.string(),
            createdBy: z.string(),
            id: z.string(),
        })
        .parse(content)
}
