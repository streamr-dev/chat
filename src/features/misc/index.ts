import { MiscState, TokenInfo } from '$/features/misc/types'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { tokenMetadataCacheKey } from '$/hooks/useTokenMetadata'
import { Address, IFingerprinted, TokenMetadata } from '$/types'
import isBlank from '$/utils/isBlank'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { NavigateFunction } from 'react-router-dom'

export const MiscAction = {
    goto: createAction<string>('misc: goto'),

    setNavigate: createAction<{ navigate: undefined | NavigateFunction }>('misc: set navigate'),

    fetchKnownTokens: createAction('misc: fetch known tokens'),

    setKnownTokens: createAction<TokenInfo[]>('misc: set known tokens'),

    setKnownTokensFilter: createAction<string>('misc: set known tokens filter'),

    fetchTokenStandard: createAction<
        IFingerprinted & { address: Address; showLoadingToast: boolean }
    >('misc: fetch token standard'),

    setTokenStandard: createAction<{ address: Address; standard: undefined | TokenStandard }>(
        'misc: set token standard'
    ),

    fetchTokenMetadata: createAction<
        IFingerprinted & {
            tokenAddress: Address
            tokenIds: string[]
            tokenStandard: TokenStandard
        }
    >('misc: fetch token metadata'),

    cacheTokenMetadata: createAction<{
        tokenAddress: Address
        tokenIds: string[]
        tokenMetadata: TokenMetadata
    }>('misc: cache token metadata'),
}

const initialState: MiscState = {
    filteredKnownTokens: [],
    knownTokens: [],
    knownTokensByAddress: {},
    knownTokensFilter: '',
    navigate: undefined,
    tokenStandards: {},
    tokenMetadatas: {},
}

function filterTokens(knownTokens: TokenInfo[], phrase: string) {
    if (isBlank(phrase)) {
        return knownTokens
    }

    const p = phrase.toLowerCase()

    return knownTokens.filter(({ name, symbol, address }) => {
        return (
            name.toLowerCase().includes(p) ||
            symbol.toLowerCase().includes(p) ||
            address.toLowerCase().includes(p)
        )
    })
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(MiscAction.setNavigate, (state, { payload: { navigate } }) => {
        state.navigate = navigate
    })

    b.addCase(MiscAction.setKnownTokens, (state, { payload }) => {
        state.knownTokens = payload

        const map: Record<Address, TokenInfo> = {}

        payload.forEach((ti) => {
            map[ti.address.toLowerCase()] = ti
        })

        state.knownTokensByAddress = map

        state.filteredKnownTokens = filterTokens(payload, state.knownTokensFilter)
    })

    b.addCase(MiscAction.setKnownTokensFilter, (state, { payload }) => {
        state.knownTokensFilter = payload

        state.filteredKnownTokens = filterTokens(state.knownTokens, payload)
    })

    b.addCase(MiscAction.setTokenStandard, (state, { payload: { address, standard } }) => {
        if (typeof standard === 'undefined') {
            delete state.tokenStandards[address.toLowerCase()]

            return
        }

        state.tokenStandards[address.toLowerCase()] = standard
    })

    b.addCase(
        MiscAction.cacheTokenMetadata,
        (state, { payload: { tokenAddress, tokenIds, tokenMetadata } }) => {
            state.tokenMetadatas[JSON.stringify(tokenMetadataCacheKey(tokenAddress, tokenIds))] =
                tokenMetadata
        }
    )
})

export default reducer
