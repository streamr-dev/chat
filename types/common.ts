export enum StorageKey {
    WalletIntegrationId = 'chat/walletIntegrationId',
    EncryptedSession = 'chat/encrypted-session',
    RoomIds = 'chat/room-ids',
}

export interface IRecord {
    owner: string
    createdAt: number
    updatedAt: number
}
