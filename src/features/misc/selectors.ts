import { State } from '$/types'

export function selectNavigate(state: State) {
    return state.misc.navigate
}
