import { configureStore } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import wallet, { walletSaga } from '$/features/wallet'
import delegation, { delegationSaga } from '$/features/delegation'
import room, { roomSaga } from '$/features/room'
import rooms, { roomsSaga } from '$/features/rooms'
import members, { membersSaga } from '$/features/members'
import member, { memberSaga } from '$/features/member'
import permission, { permissionSaga } from '$/features/permission'
import drafts, { draftsSaga } from '$/features/drafts'
import identicons, { identiconsSaga } from '$/features/identicons'
import tokenGatedRooms, { tokenGatedRoomSaga } from '$/features/tokenGatedRooms'
import clock from '$/features/clock'
import createSagaMiddleware from 'redux-saga'
import message, { messageSaga } from '$/features/message'
import preferences, { preferencesSaga } from '$/features/preferences'
import { aliasSaga } from '$/features/alias'
import flag from '$/features/flag'
import ens, { ensSaga } from '$/features/ens'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {
        clock,
        delegation,
        drafts,
        ens,
        flag,
        identicons,
        member,
        members,
        message,
        permission,
        preferences,
        room,
        rooms,
        wallet,
        tokenGatedRooms,
    },
    middleware(getDefaultMiddleware) {
        return [
            ...getDefaultMiddleware({
                serializableCheck: {
                    ignoredActionPaths: ['payload.provider', 'payload.streamrClient'],
                    ignoredActions: [],
                    ignoredPaths: ['wallet.provider', 'wallet.client', 'delegation.client'],
                },
            }),
            sagaMiddleware,
        ]
    },
})

sagaMiddleware.run(function* saga() {
    yield all([
        aliasSaga(),
        delegationSaga(),
        draftsSaga(),
        ensSaga(),
        identiconsSaga(),
        memberSaga(),
        membersSaga(),
        messageSaga(),
        permissionSaga(),
        preferencesSaga(),
        roomSaga(),
        roomsSaga(),
        walletSaga(),
        tokenGatedRoomSaga(),
    ])
})

export default store
