import { createContext, useContext, useReducer } from 'react'
import StreamrClient from 'streamr-client'
import type {
    ChatState,
    RoomPayload,
    MessagePayload,
    MessagesCollection,
    DraftCollection,
} from '../utils/types'

const initialState = {
    drafts: {},
    identity: undefined,
    messages: {},
    roomId: undefined,
    roomNameEditable: false,
    rooms: [],
    metamaskAddress: '',
    sessionAddress: '',
    streamrClient: undefined,
}

export enum ActionType {
    AddMessages = 'add messages',
    AddRooms = 'add rooms',
    EditRoomName = 'edit room name',
    RenameRoom = 'rename room',
    Reset = 'reset',
    SelectRoom = 'select room',
    SetDraft = 'set draft',
    SetIdentity = 'set identity',
    SetMessages = 'set messages',
    SetRooms = 'set rooms',
    SetMetamaskAddress = 'set metamask address',
    SetSessionAddress = 'set session address',
    SetStreamrClient = 'set streamr client',
}

type Action<A, B> = {
    type: A
    payload: B
}

type SelectRoomAction = Action<ActionType.SelectRoom, string>

type AddRoomsAction = Action<ActionType.AddRooms, RoomPayload[]>

type SetRoomsAction = Action<ActionType.SetRooms, RoomPayload[]>

type AddMessagesAction = Action<ActionType.AddMessages, MessagePayload[]>

type SetMessagesAction = Action<ActionType.SetMessages, MessagePayload[]>

type SetIdentityAction = Action<ActionType.SetIdentity, string | undefined>

type ResetAction = Omit<Action<ActionType.Reset, undefined>, 'payload'>

type SetDraftAction = Action<ActionType.SetDraft, string>

type RenameRoomAction = Action<ActionType.RenameRoom, string>

type EditRoomNameAction = Action<ActionType.EditRoomName, boolean>

type SetMetamaskAddressAction = Action<ActionType.SetMetamaskAddress, string>

type SetSessionAddressAction = Action<ActionType.SetSessionAddress, string>

type SetStreamrClient = Action<ActionType.SetStreamrClient, StreamrClient>

type A =
    | SelectRoomAction
    | AddRoomsAction
    | SetRoomsAction
    | AddMessagesAction
    | SetMessagesAction
    | SetIdentityAction
    | ResetAction
    | SetDraftAction
    | RenameRoomAction
    | EditRoomNameAction
    | SetMetamaskAddressAction
    | SetSessionAddressAction
    | SetStreamrClient

function reducer(state: ChatState, action: A): ChatState {
    switch (action.type) {
        case ActionType.EditRoomName:
            return {
                ...state,
                roomNameEditable: action.payload,
            }
        case ActionType.RenameRoom:
            ;((room: RoomPayload | undefined) => {
                if (room) {
                    room.name = action.payload
                }
            })(state.rooms.find(({ id }) => id === state.roomId))

            return {
                ...state,
                roomNameEditable: false,
            }
        case ActionType.SetDraft:
            return !state.roomId
                ? state
                : {
                      ...state,
                      drafts: {
                          ...state.drafts,
                          [state.roomId]: action.payload,
                      },
                  }
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
                roomNameEditable: false,
            }
        case ActionType.SetRooms:
            return {
                ...state,
                roomId:
                    !state.roomId && action.payload.length
                        ? action.payload[0].id
                        : state.roomId,
                rooms: action.payload,
                messages: action.payload.reduce(
                    (memo: MessagesCollection, { id }: RoomPayload) => {
                        Object.assign(memo, {
                            [id]: state.messages[id] || [],
                        })

                        return memo
                    },
                    {}
                ),
                drafts: action.payload.reduce(
                    (memo: DraftCollection, { id }: RoomPayload) => {
                        Object.assign(memo, {
                            [id]: state.drafts[id] || '',
                        })

                        return memo
                    },
                    {}
                ),
            }
        case ActionType.AddRooms:
            return reducer(state, {
                type: ActionType.SetRooms,
                payload: [...state.rooms, ...action.payload],
            })
        case ActionType.SetMessages:
            return state.roomId == null
                ? state
                : {
                      ...state,
                      messages: {
                          ...state.messages,
                          [state.roomId]: action.payload,
                      },
                  }
        case ActionType.AddMessages:
            return state.roomId == null
                ? state
                : reducer(state, {
                      type: ActionType.SetMessages,
                      payload: [
                          ...state.messages[state.roomId],
                          ...action.payload,
                      ],
                  })
        case ActionType.SetMetamaskAddress:
            return {
                ...state,
                metamaskAddress: action.payload,
            }
        case ActionType.SetSessionAddress:
            return {
                ...state,
                sessionAddress: action.payload,
            }
        case ActionType.SetStreamrClient:
            return {
                ...state,
                streamrClient: action.payload,
            }
        default:
            return state
    }
}

type Props = {
    children?: React.ReactNode
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

export function useDraft(): string {
    const { roomId, drafts } = useStore()

    if (!roomId) {
        return ''
    }

    return drafts[roomId]
}

export default function Store({ children }: Props) {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}
