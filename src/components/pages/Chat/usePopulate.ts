import { useEffect, useRef } from "react"
import { ActionType, useDispatch } from "./ChatStore"
import type { RoomPayload } from "./types"
import { v4 as uuidv4 } from 'uuid'

// TBD from streamr client.
const SOMEONE = '0x0x7da4E5E40C41f5eCbeFb4fa59B2153888a11731'

// TBD from streamr client
const SOMEONE_ELSE = '0x0xcd9c7c57a2d1468686c2d141530f7b70e771c05'

const room0: RoomPayload = {
    id: uuidv4(),
    name: 'Lorem ipsums dfkjashdfb kjashbf kjasbhfdk jabsdf',
    readAt: new Date(2022, 12, 20).getTime(), // future, altho no messages (wat? lol)
}

const room1: RoomPayload = {
    id: uuidv4(),
    name: 'sfkhsdfkjbdkgbsdkfhbgksdjhbfgksjdhgsdfjbs',
    readAt: new Date(2021, 12, 20).getTime(), // past
}

const room2: RoomPayload = {
    id: uuidv4(),
    name: 'Emat',
    readAt: new Date(2022, 12, 20).getTime(), // future
}

export default function usePopulate(identity: string) {
    const dispatch = useDispatch()

    const identityRef = useRef(identity)

    useEffect(() => {
        dispatch({
            type: ActionType.Reset,
        })

        dispatch({
            type: ActionType.SetIdentity,
            payload: identityRef.current,
        })

        dispatch({
            type: ActionType.AddRooms,
            payload: [
                room0,
                room1,
                room2,
            ],
        })

        dispatch({
            type: ActionType.AddMessages,
            payload: [
                { id: uuidv4(), sender: SOMEONE, body: 'Hey there', createdAt: new Date(2020, 12, 20).getTime() },
                { id: uuidv4(), sender: SOMEONE, body: 'U guys heard of that new virus thing?', createdAt: new Date(2020, 12, 20).getTime() },
                { id: uuidv4(), sender: identityRef.current, body: 'Yep, nothing to worry about', createdAt: new Date(2020, 12, 20).getTime() },
                { id: uuidv4(), sender: identityRef.current, body: 'lol', createdAt: new Date(2020, 12, 20).getTime() },
                { id: uuidv4(), sender: SOMEONE, body: 'sic', createdAt: new Date(2021, 3, 26).getTime() },
                { id: uuidv4(), sender: SOMEONE_ELSE, body: 'lol', createdAt: new Date(2021, 12, 20).getTime() },
                { id: uuidv4(), sender: SOMEONE_ELSE, body: 'that did not age well', createdAt: new Date(2021, 12, 20).getTime() },
                { id: uuidv4(), sender: identityRef.current, body: 'ikr?!', createdAt: new Date(2021, 12, 20).getTime() },        
            ],
        })
    }, [dispatch])
}
