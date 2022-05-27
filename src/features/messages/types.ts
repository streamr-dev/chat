import { IRecord } from '../../../types/common'

export interface IMessage extends IRecord {
    content: string
    createdBy: string
    id: string
    roomId: string
}
