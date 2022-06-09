import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { STREAMR_STORAGE_NODE_GERMANY } from 'streamr-client'
import { Address, PrivacySetting } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import changePrivacy from './sagas/changePrivacy.saga'
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

const initialState: RoomState = {
    selectedId: undefined,
    storageNodes: {},
    privacy: {},
}

function storageNodes(state: RoomState, roomId: RoomId) {
    if (!state.storageNodes[roomId]) {
        state.storageNodes[roomId] = {
            addresses: {},
            getting: false,
        }
    }

    return state.storageNodes[roomId]
}

function roomNodeUrl(state: RoomState, roomId: RoomId, address: string) {
    const roomNodes = storageNodes(state, roomId)

    if (!roomNodes.addresses[address]) {
        roomNodes.addresses[address] = {
            state: false,
            toggling: false,
        }
    }

    return roomNodes.addresses[address]
}

function privacy(state: RoomState, roomId: RoomId) {
    if (!state.privacy[roomId]) {
        state.privacy[roomId] = {
            changing: false,
            getting: false,
            value: PrivacySetting.Private,
        }
    }

    return state.privacy[roomId]
}

export const RoomAction = {
    create: createAction<IRoom>('room: create'),
    delete: createAction<RoomId>('room: delete'),
    deleteLocal: createAction<RoomId>('room: delete local'),
    rename: createAction<{ roomId: RoomId; name: string }>('room: rename'),
    renameLocal: createAction<{ roomId: RoomId; name: string }>('room: rename local'),
    select: createAction<RoomState['selectedId']>('room: select'),
    sync: createAction<RoomId>('room: sync'),
    getStorageNodes: createAction<RoomId>('room: get storage nodes'),
    setGettingStorageNodes: createAction<{ roomId: RoomId; state: boolean }>(
        'room: set getting strorage nodes'
    ),
    setLocalStorageNodes: createAction<{ roomId: RoomId; addresses: string[] }>(
        'room: set local storage nodes'
    ),
    setLocalStorageNode: createAction<{ roomId: RoomId; address: string; state: boolean }>(
        'room: set local storage node (one)'
    ),
    toggleStorageNode: createAction<{ roomId: RoomId; address: string; state: boolean }>(
        'room: toggle storage node'
    ),
    setTogglingStorageNode: createAction<{ roomId: RoomId; address: string; state: boolean }>(
        'room: set toggling storage node'
    ),
    changePrivacy: createAction<{ roomId: RoomId; privacy: PrivacySetting }>(
        'room: change privacy'
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
    getPrivacy: createAction<RoomId>('room: get privacy'),
    registerInvite: createAction<{ roomId: RoomId; address: Address }>('room: register invite'),
    fetch: createAction<{ roomId: RoomId; address: Address }>('room: fetch'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(RoomAction.create, SEE_SAGA)

    builder.addCase(RoomAction.rename, SEE_SAGA)

    builder.addCase(RoomAction.renameLocal, SEE_SAGA)

    builder.addCase(RoomAction.select, (state, { payload: selectedId }) => {
        state.selectedId = selectedId
    })

    builder.addCase(RoomAction.delete, SEE_SAGA)

    builder.addCase(RoomAction.deleteLocal, SEE_SAGA)

    builder.addCase(RoomAction.sync, SEE_SAGA)

    builder.addCase(RoomAction.getStorageNodes, SEE_SAGA)

    builder.addCase(
        RoomAction.setGettingStorageNodes,
        (state, { payload: { roomId, state: getting } }) => {
            storageNodes(state, roomId).getting = getting
        }
    )

    builder.addCase(
        RoomAction.setLocalStorageNodes,
        (state, { payload: { roomId, addresses } }) => {
            const currentAddresses = storageNodes(state, roomId).addresses

            // Resetting states individually does not affect `toggling` flag.
            Object.keys(currentAddresses).forEach((address) => {
                roomNodeUrl(state, roomId, address).state = false
            })

            addresses.forEach((address) => {
                roomNodeUrl(state, roomId, address.toLowerCase()).state = true
            })
        }
    )

    builder.addCase(
        RoomAction.setLocalStorageNode,
        (state, { payload: { roomId, address, state: enabled } }) => {
            roomNodeUrl(state, roomId, address.toLowerCase()).state = enabled
        }
    )

    builder.addCase(RoomAction.toggleStorageNode, SEE_SAGA)

    builder.addCase(
        RoomAction.setTogglingStorageNode,
        (state, { payload: { roomId, address, state: toggling } }) => {
            roomNodeUrl(state, roomId, address.toLowerCase()).toggling = toggling
        }
    )

    builder.addCase(RoomAction.changePrivacy, SEE_SAGA)

    builder.addCase(
        RoomAction.setLocalPrivacy,
        (state, { payload: { roomId, privacy: value } }) => {
            privacy(state, roomId).value = value
        }
    )

    builder.addCase(
        RoomAction.setChangingPrivacy,
        (state, { payload: { roomId, state: changing } }) => {
            privacy(state, roomId).changing = changing
        }
    )

    builder.addCase(
        RoomAction.setGettingPrivacy,
        (state, { payload: { roomId, state: getting } }) => {
            privacy(state, roomId).getting = getting
        }
    )

    builder.addCase(RoomAction.getPrivacy, SEE_SAGA)

    builder.addCase(RoomAction.registerInvite, SEE_SAGA)

    builder.addCase(RoomAction.fetch, SEE_SAGA)
})

export function* roomSaga() {
    yield all([
        changePrivacy(),
        create(),
        del(),
        delLocal(),
        fetch(),
        getPrivacy(),
        getStorageNodes(),
        registerInvite(),
        rename(),
        renameLocal(),
        sync(),
        toggleStorageNode(),
    ])
}

export default reducer
