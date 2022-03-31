import { createContext, useContext, useReducer } from 'react'
import StreamrClient from 'streamr-client'
import { RoomId } from '../utils/types'
import uniq from 'lodash/uniq'

import type { ChatState, MessagePayload } from '../utils/types'
import { Wallet } from 'ethers'
import { MetaMaskInpageProvider } from '@metamask/providers'
import getInitialChatState from '../getters/getInitialStoreState'
import RoomRenameProvider from './pages/Chat/RoomRenameProvider'
import getEnvironmentConfig from '../getters/getEnvironmentConfig'

export enum ActionType {
    AddRooms = 'add rooms',
    EditRoomName = 'edit room name',
    RenameRoom = 'rename room',
    Reset = 'reset',
    SelectRoom = 'select room',
    SetDraft = 'set draft',
    SetMessages = 'set messages',
    SetRooms = 'set rooms',
    SetSession = 'set session',
    SetEthereumProvider = 'set ethereum provider',
    SetAccount = 'set provider account',
    AddRoomIds = 'add room ids',
    SetRoomIds = 'set room ids',
    SetRecentMessage = 'set recent message',
    RemoveRoomId = 'remove room id',
    SetRoomMembers = 'set room members',
}

type Action<A, B> = {
    type: A
    payload: B
}

type PayloadlessAction<A> = Omit<Action<A, any>, 'payload'>

type SelectRoomAction = Action<ActionType.SelectRoom, string>

type SetMessagesAction = Action<ActionType.SetMessages, MessagePayload[]>

type ResetAction = PayloadlessAction<ActionType.Reset>

type SetDraftAction = Action<ActionType.SetDraft, string>

type RenameRoomAction = Action<
    ActionType.RenameRoom,
    { [index: RoomId]: string }
>

type EditRoomNameAction = Action<ActionType.EditRoomName, boolean>

type SetSessionAction = Action<ActionType.SetSession, string>

type SetEthereumProviderAction = Action<
    ActionType.SetEthereumProvider,
    MetaMaskInpageProvider | undefined
>

type SetAccountAction = Action<ActionType.SetAccount, string | undefined>

type AddRoomIdsAction = Action<ActionType.AddRoomIds, string[]>

type SetRoomIdsAction = Action<ActionType.SetRoomIds, string[] | undefined>

type SetRecentMessageAction = Action<
    ActionType.SetRecentMessage,
    { [index: RoomId]: string }
>

type RemoveRoomIdAction = Action<ActionType.RemoveRoomId, RoomId>

type SetRoomMembersAction = Action<
    ActionType.SetRoomMembers,
    { roomId: string; members: string[] }
>

type A =
    | SelectRoomAction
    | SetMessagesAction
    | ResetAction
    | SetDraftAction
    | RenameRoomAction
    | EditRoomNameAction
    | SetSessionAction
    | SetEthereumProviderAction
    | SetAccountAction
    | AddRoomIdsAction
    | SetRoomIdsAction
    | SetRecentMessageAction
    | RemoveRoomIdAction
    | SetRoomMembersAction

function reducer(state: ChatState, action: A): ChatState {
    switch (action.type) {
        case ActionType.EditRoomName:
            return {
                ...state,
                roomNameEditable: action.payload,
            }
        case ActionType.RenameRoom:
            return {
                ...state,
                roomNames: {
                    ...state.roomNames,
                    ...action.payload,
                },
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
            return {
                ...getInitialChatState(),
                // Keep the provider. We may wanna extract it from "chat" state. It's actually more
                // of a browser/app state piece.
                ethereumProvider: state.ethereumProvider,
                ethereumProviderReady: state.ethereumProviderReady,
            }
        case ActionType.SelectRoom:
            return {
                ...state,
                roomId: action.payload,
                roomNameEditable: false,
            }
        case ActionType.SetMessages:
            return {
                ...state,
                messages: state.roomId ? [...action.payload] : [],
            }

        case ActionType.SetSession:
            const { StreamrClientConfig } = getEnvironmentConfig()

            return {
                ...state,
                metamaskStreamrClient: new StreamrClient({
                    ...StreamrClientConfig,
                    auth: { ethereum: state.ethereumProvider as any },
                }),
                session: {
                    streamrClient: new StreamrClient({
                        ...StreamrClientConfig,
                        auth: {
                            privateKey: action.payload,
                        },
                    }),
                    wallet: new Wallet(action.payload),
                },
            }
        case ActionType.SetEthereumProvider:
            return {
                ...state,
                ethereumProvider: action.payload || undefined,
                ethereumProviderReady: true,
            }
        case ActionType.SetAccount:
            return action.payload === state.account
                ? state
                : {
                      ...reducer(state, {
                          type: ActionType.Reset,
                      }),
                      account: action.payload || undefined,
                  }
        case ActionType.SetRoomIds:
            return {
                ...state,
                roomIds: !action.payload ? undefined : uniq(action.payload),
            }
        case ActionType.AddRoomIds:
            return reducer(state, {
                type: ActionType.SetRoomIds,
                payload: [...(state.roomIds || []), ...action.payload],
            })
        case ActionType.SetRecentMessage:
            return {
                ...state,
                recentMessages: {
                    ...state.recentMessages,
                    ...action.payload,
                },
            }
        case ActionType.RemoveRoomId:
            return {
                ...state,
                roomId:
                    state.roomId === action.payload ? undefined : state.roomId,
                roomIds:
                    state.roomIds != null
                        ? state.roomIds.filter((id) => id !== action.payload)
                        : state.roomIds,
            }

        case ActionType.SetRoomMembers:
            return {
                ...state,
                roomMembers: {
                    ...state.roomMembers,
                    [action.payload.roomId]: [...action.payload.members],
                },
            }
        default:
            return state
    }
}

type Props = {
    children?: React.ReactNode
}

const StateContext = createContext<ChatState>(getInitialChatState())

type DispatchFn = (arg0: A) => void

const DispatchContext = createContext<DispatchFn>(() => {})

export function useStore() {
    return useContext(StateContext)
}

export function useDispatch() {
    return useContext(DispatchContext)
}

export function useDraft(): string {
    const { roomId, drafts } = useStore()

    return roomId ? drafts[roomId] : ''
}

export default function Store({ children }: Props) {
    const [state, dispatch] = useReducer(reducer, getInitialChatState())

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                <RoomRenameProvider>{children}</RoomRenameProvider>
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}
