import { configureStore } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import wallet, { walletSaga } from '$/features/wallet'
import delegation from '$/features/delegation'
import room, { roomSaga } from '$/features/room'
import rooms, { roomsSaga } from '$/features/rooms'
import permissions, { permissionsSaga } from '$/features/permissions'
import drafts, { draftsSaga } from '$/features/drafts'
import identicons, { identiconsSaga } from '$/features/identicons'
import tokenGatedRooms, { tokenGatedRoomSaga } from '$/features/tokenGatedRooms'
import clock from '$/features/clock'
import createSagaMiddleware from 'redux-saga'
import message, { messageSaga } from '$/features/message'
import misc, { miscSaga } from '$/features/misc'
import preferences, { preferencesSaga } from '$/features/preferences'
import { aliasSaga } from '$/features/alias'
import flag from '$/features/flag'
import ens, { ensSaga } from '$/features/ens'
import lifecycle from '$/features/lifecycle.saga'
import anon from '$/features/anon'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {
        clock,
        delegation,
        drafts,
        ens,
        flag,
        identicons,
        permissions,
        message,
        preferences,
        room,
        rooms,
        wallet,
        tokenGatedRooms,
        misc,
        anon,
    },
    middleware(getDefaultMiddleware) {
        return [
            ...getDefaultMiddleware({
                serializableCheck: {
                    ignoredActionPaths: [
                        'payload.provider',
                        'payload.streamrClient',
                        'payload.navigate',
                        'payload.wallet',
                    ],
                    ignoredActions: [],
                    ignoredPaths: [
                        'wallet.provider',
                        'wallet.client',
                        'delegation.client',
                        'misc.navigate',
                        'anon.rooms',
                        'anon.rooms',
                    ],
                },
            }),
            sagaMiddleware,
        ]
    },
})

sagaMiddleware.run(function* saga() {
    yield all([
        aliasSaga(),
        draftsSaga(),
        ensSaga(),
        identiconsSaga(),
        permissionsSaga(),
        messageSaga(),
        preferencesSaga(),
        roomSaga(),
        roomsSaga(),
        walletSaga(),
        tokenGatedRoomSaga(),
        miscSaga(),
        lifecycle(),
    ])
})

export default store
