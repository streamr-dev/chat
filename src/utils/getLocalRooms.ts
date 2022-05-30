import { Address } from '../../types/common'
import { IRoom } from '../features/rooms/types'
import db from './db'

export default async function getLocalRooms(owner: Address): Promise<IRoom[]> {
    return db.rooms.where('owner').equals(owner.toLowerCase()).toArray()
}
