import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { Address, IFingerprinted, OptionalAddress, PreflightParams, PrivacySetting } from '$/types'
import create from './sagas/create.saga'
import del from './sagas/del.saga'
import delLocal from './sagas/delLocal.saga'
import fetch from './sagas/fetch.saga'
import getPrivacy from './sagas/getPrivacy.saga'
import getStorageNodes from './sagas/getStorageNodes.saga'
import registerInvite from './sagas/registerInvite.saga'
import rename from './sagas/rename.saga'
import renameLocal from './sagas/renameLocal.saga'
import sync from './sagas/sync.saga'
import toggleStorageNode from './sagas/toggleStorageNode.saga'
import { IRoom, RoomId, RoomState } from './types'
import setVisibility from '$/features/room/sagas/setVisibility.saga'
import StreamrClient from 'streamr-client'
import unpin from '$/features/room/sagas/unpin.saga'
import { TokenGate } from '$/features/tokenGatedRooms/types'

const initialState: RoomState = {
    selectedRoomId: undefined,
    cache: {},
    searchResults: {},
    recentRoomId: undefined,
}

function roomCache(state: RoomState, roomId: RoomId) {
    let cache = state.cache[roomId]

    if (!cache) {
        cache = {
            storageNodes: {},
        }

        state.cache[roomId] = cache
    }

    return cache
}

export const RoomAction = {
    create: createAction<
        PreflightParams & {
            params: IRoom
            privacy: PrivacySetting
            storage: boolean
            streamrClient: StreamrClient
        }
    >('room: create'),

    delete: createAction<
        IFingerprinted &
            PreflightParams & {
                roomId: RoomId
                streamrClient: StreamrClient
            }
    >('room: delete'),

    deleteLocal: createAction<{ roomId: RoomId; requester: Address }>('room: delete local'),

    rename: createAction<
        IFingerprinted &
            PreflightParams & {
                roomId: RoomId
                name: string
                streamrClient: StreamrClient
            }
    >('room: rename'),

    renameLocal: createAction<{ roomId: RoomId; name: string }>('room: rename local'),

    select: createAction<RoomState['selectedRoomId']>('room: select'),

    preselect: createAction<
        IFingerprinted & {
            roomId: RoomId
            account: OptionalAddress
            streamrClient: StreamrClient
        }
    >('room: preselect'),

    sync: createAction<
        IFingerprinted & { roomId: RoomId; requester: Address; streamrClient: StreamrClient }
    >('room: sync'),

    getStorageNodes: createAction<
        IFingerprinted & { roomId: RoomId; streamrClient: StreamrClient }
    >('room: get storage nodes'),

    setGettingStorageNodes: createAction<{ roomId: RoomId; state: boolean }>(
        'room: set getting strorage nodes'
    ),

    setLocalStorageNodes: createAction<{ roomId: RoomId; addresses: string[] }>(
        'room: set local storage nodes'
    ),

    setLocalStorageNode: createAction<{ roomId: RoomId; address: string; state: boolean }>(
        'room: set local storage node (one)'
    ),

    toggleStorageNode: createAction<
        IFingerprinted &
            PreflightParams & {
                roomId: RoomId
                address: string
                state: boolean
                streamrClient: StreamrClient
            }
    >('room: toggle storage node'),

    setTogglingStorageNode: createAction<{ roomId: RoomId; address: string; state: boolean }>(
        'room: set toggling storage node'
    ),

    setLocalPrivacy: createAction<{ roomId: RoomId; privacy: PrivacySetting }>(
        'room: set local privacy'
    ),

    setChangingPrivacy: createAction<{ roomId: RoomId; state: boolean }>(
        'room: set changing privacy'
    ),

    setGettingPrivacy: createAction<{ roomId: RoomId; state: boolean }>(
        'room: set getting privacy'
    ),

    getPrivacy: createAction<IFingerprinted & { roomId: RoomId; streamrClient: StreamrClient }>(
        'room: get privacy'
    ),

    registerInvite: createAction<
        IFingerprinted & { roomId: RoomId; invitee: Address; streamrClient: StreamrClient }
    >('room: register invite'),

    fetch: createAction<{ roomId: RoomId; requester: Address; streamrClient: StreamrClient }>(
        'room: fetch'
    ),

    setPersistingName: createAction<{ roomId: RoomId; state: boolean }>(
        'room: set persisting name'
    ),

    setTransientName: createAction<{ roomId: RoomId; name: string }>('room: set transient name'),

    setVisibility: createAction<{ roomId: RoomId; owner: Address; visible: boolean }>(
        'room: set visibility'
    ),

    pinSticky: createAction<
        IFingerprinted & {
            requester: Address
            streamrClient: StreamrClient
        }
    >('room: pin sticky'),

    unpin: createAction<
        IFingerprinted & { roomId: RoomId; requester: Address; streamrClient: StreamrClient }
    >('room: unpin'),

    setPinning: createAction<{ owner: Address; roomId: RoomId; state: boolean }>(
        'room: set pinning'
    ),

    cacheTokenGate: createAction<{
        roomId: RoomId
        tokenGate: Required<
            Pick<TokenGate, 'tokenAddress' | 'tokenIds' | 'minRequiredBalance'>
        > | null
    }>('room: cache token gate'),

    search: createAction<IFingerprinted & { roomId: RoomId; streamrClient: StreamrClient }>(
        'room: search'
    ),

    cacheSearchResult: createAction<{
        roomId: RoomId
        metadata: { name: string; tokenAddress: OptionalAddress } | null
    }>('room: cache search result'),

    cacheRecentRoomId: createAction<RoomId | undefined>('room: cache recent room id'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(RoomAction.select, (state, { payload: selectedRoomId }) => {
        state.selectedRoomId = selectedRoomId
    })

    builder.addCase(
        RoomAction.setLocalStorageNodes,
        (state, { payload: { roomId, addresses } }) => {
            const currentAddresses = roomCache(state, roomId).storageNodes

            Object.keys(currentAddresses).forEach((address) => {
                roomCache(state, roomId).storageNodes[address.toLowerCase()] = false
            })

            addresses.forEach((address) => {
                roomCache(state, roomId).storageNodes[address.toLowerCase()] = true
            })
        }
    )

    builder.addCase(
        RoomAction.setLocalStorageNode,
        (state, { payload: { roomId, address, state: enabled } }) => {
            roomCache(state, roomId).storageNodes[address.toLowerCase()] = enabled
        }
    )

    builder.addCase(RoomAction.setLocalPrivacy, (state, { payload: { roomId, privacy } }) => {
        roomCache(state, roomId).privacy = privacy
    })

    builder.addCase(RoomAction.setTransientName, (state, { payload: { roomId, name } }) => {
        roomCache(state, roomId).temporaryName = name
    })

    builder.addCase(RoomAction.cacheTokenGate, (state, { payload: { roomId, tokenGate } }) => {
        roomCache(state, roomId).tokenGate = tokenGate
    })

    builder.addCase(RoomAction.cacheSearchResult, (state, { payload: { roomId, metadata } }) => {
        state.searchResults[roomId] = metadata
    })

    builder.addCase(RoomAction.cacheRecentRoomId, (state, { payload }) => {
        state.recentRoomId = payload
    })
})

export function* roomSaga() {
    yield all([
        create(),
        del(),
        delLocal(),
        fetch(),
        getPrivacy(),
        getStorageNodes(),
        registerInvite(),
        rename(),
        renameLocal(),
        setVisibility(),
        sync(),
        toggleStorageNode(),
        unpin(),
    ])
}

export default reducer
