import { ChatState } from '../utils/types'

export default function getInitialChatState(): ChatState {
    return {
        account: undefined,
        drafts: {},
        ethereumProvider: undefined,
        metamaskStreamrClient: undefined,
        ethereumProviderReady: false,
        messages: [],
        recentMessages: {},
        roomId: undefined,
        roomIds: undefined,
        roomNameEditable: false,
        roomNames: {},
        session: {
            streamrClient: undefined,
            wallet: undefined,
        },
        roomMembers: {},
    }
}
