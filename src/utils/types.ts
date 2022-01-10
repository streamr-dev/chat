export type RoomPayload = {
    id: string,
    name: string,
    readAt: number,
}

export type MessagePayload = {
    body: string,
    createdAt: number,
    sender: string,
    id: string,
}

export type MessagesCollection = {
    [index: string]: Array<MessagePayload>,
}

export type DraftCollection = {
    [index: string]: string,
}

export type ChatState = {
    drafts: any,
    identity?: string,
    messages: MessagesCollection,
    roomId?: string,
    roomNameEditable: boolean,
    rooms: RoomPayload[],
    metamaskAddress: string,
}
