import { createContext, useContext, useReducer } from "react"

type State = {
    rooms: Array<any>,
    messages: any,
    drafts: any,
}

type BaseAction = {
    type: string,
}

type Action = BaseAction

function reducer(state: State, action: Action) {
    switch (action.type) {
        default:
            return state
    }
}

type Props = {
    children?: React.ReactNode,
}

const initialState: State = {
    rooms: [],
    messages: {},
    drafts: {},
}

const StateContext = createContext<State>(initialState)

type DispatchFn = (arg0: Action) => void

const DispatchContext = createContext<DispatchFn>(() => {})

export function useStore() {
    return useContext(StateContext)
}

export function useDispatch() {
    return useContext(DispatchContext)
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
