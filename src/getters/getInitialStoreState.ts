import { ChatState } from "../utils/types";

export default function getInitialChatState(): ChatState {
    return {
        drafts: {},
        ethereumProvider: undefined,
        ethereumProviderReady: false,
        identity: undefined,
        messages: {},
        metamaskAddress: '',
        roomId: undefined,
        roomNameEditable: false,
        rooms: [],
        session: {
            streamrClient: undefined,
            wallet: undefined,
        },
    }
}
