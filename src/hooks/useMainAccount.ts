import { OptionalAddress, State } from '$/types'
import { useSelector } from 'react-redux'

export function selectMainAccount(delegatedAccount: OptionalAddress) {
    return (state: State) =>
        delegatedAccount ? state.delegation.delegations[delegatedAccount.toLowerCase()] : undefined
}

export default function useMainAccount(delegatedAccount: OptionalAddress): undefined | string {
    return useSelector(selectMainAccount(delegatedAccount))
}
