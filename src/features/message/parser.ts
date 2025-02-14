import { z } from 'zod'

export function parseChatMessage(content: unknown) {
    return z
        .object({
            content: z.string(),
        })
        .parse(content)
}
