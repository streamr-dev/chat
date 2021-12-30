import { createContext, useContext, useReducer } from "react"
import type { ChatState, RoomPayload, MessagePayload, MessagesCollection } from './types'

const initialState = {
    drafts: {},
    identity: undefined,
    messages: {},
    roomId: undefined,
    rooms: [],
}

export enum ActionType {
    AddMessages = 'add messages',
    AddRooms = 'add rooms',
    Reset = 'reset',
    SelectRoom = 'select room',
    SetIdentity = 'set identity',
    SetMessages = 'set messages',
    SetRooms = 'set rooms',
}

type Action<A, B> = {
    type: A,
    payload: B,
}

type SelectRoomAction = Action<ActionType.SelectRoom, string>

type AddRoomsAction = Action<ActionType.AddRooms, RoomPayload[]>

type SetRoomsAction = Action<ActionType.SetRooms, RoomPayload[]>

type AddMessagesAction = Action<ActionType.AddMessages, MessagePayload[]>

type SetMessagesAction = Action<ActionType.SetMessages, MessagePayload[]>

type SetIdentityAction = Action<ActionType.SetIdentity, string | undefined>

type ResetAction = Omit<Action<ActionType.Reset, undefined>, 'payload'>

type A = SelectRoomAction
    | AddRoomsAction
    | SetRoomsAction
    | AddMessagesAction
    | SetMessagesAction
    | SetIdentityAction
    | ResetAction

function reducer(state: ChatState, action: A): ChatState {
    switch (action.type) {
        case ActionType.Reset:
            return initialState
        case ActionType.SetIdentity:
            return {
                ...state,
                identity: action.payload,
            }
        case ActionType.SelectRoom:
            return {
                ...state,
                roomId: action.payload,
            }
        case ActionType.SetRooms:
            return {
                ...state,
                roomId: state.roomId == null && action.payload.length ? action.payload[0].id : undefined,
                rooms: action.payload,
                messages: action.payload.reduce((memo: MessagesCollection, { id }: RoomPayload) => {
                    Object.assign(memo, {
                        [id]: state.messages[id] || [],
                    })

                    return memo
                }, {}),
            }
        case ActionType.AddRooms:
            return reducer(state, {
                type: ActionType.SetRooms,
                payload: [
                    ...state.rooms,
                    ...action.payload,
                ],
            })
        case ActionType.SetMessages:
            return state.roomId == null ? state : {
                ...state,
                messages: {
                    ...state.messages,
                    [state.roomId]: action.payload,
                },
            }
        case ActionType.AddMessages:
            return state.roomId == null ? state : reducer(state, {
                type: ActionType.SetMessages,
                payload: [
                    ...state.messages[state.roomId],
                    ...action.payload,
                ],
            })
        default:
            return state
    }
}

type Props = {
    children?: React.ReactNode,
}

const StateContext = createContext<ChatState>(initialState)

type DispatchFn = (arg0: A) => void

const DispatchContext = createContext<DispatchFn>(() => {})

export function useStore() {
    return useContext(StateContext)
}

export function useDispatch() {
    return useContext(DispatchContext)
}

const NO_MESSAGES: MessagePayload[] = []

export function useMessages(): MessagePayload[] {
    const { roomId, messages } = useStore()

    if (roomId == null) {
        return NO_MESSAGES
    }

    return messages[roomId]
}

export function useRoom(): RoomPayload | undefined {
    const { roomId, rooms } = useStore()

    return rooms.find(({ id }) => roomId === id)
}

export default function ChatStore({ children }: Props) {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}
