import { configureStore } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import wallet from '$/features/wallet'
import delegation from '$/features/delegation'
import room, { roomSaga } from '$/features/room'
import rooms, { roomsSaga } from '$/features/rooms'
import permissions, { permissionsSaga } from '$/features/permissions'
import drafts, { draftsSaga } from '$/features/drafts'
import identicons, { identiconsSaga } from '$/features/identicons'
import createSagaMiddleware from 'redux-saga'
import message, { messageSaga } from '$/features/message'
import misc, { miscSaga } from '$/features/misc'
import preferences, { preferencesSaga } from '$/features/preferences'
import flag from '$/features/flag'
import ens, { ensSaga } from '$/features/ens'
import lifecycle from '$/features/lifecycle.saga'
import anon from '$/features/anon'
import toaster from '$/features/toaster'
import avatar from '$/features/avatar'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {
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
        misc,
        anon,
        toaster,
        avatar,
    },
    middleware(getDefaultMiddleware) {
        return [
            ...getDefaultMiddleware({
                serializableCheck: {
                    ignoredActionPaths: [
                        'payload.provider',
                        'payload.streamrClient',
                        'payload.navigate',
                        'payload.instance',
                        'payload.wallet',
                        'payload.title',
                        'payload.desc',
                    ],
                    ignoredActions: [],
                    ignoredPaths: [
                        'wallet.provider',
                        'wallet.client',
                        'delegation.client',
                        'misc.navigate',
                        'anon.rooms',
                        'anon.rooms',
                        'toaster.instance',
                    ],
                },
            }),
            sagaMiddleware,
        ]
    },
})

sagaMiddleware.run(function* saga() {
    yield all([
        draftsSaga(),
        ensSaga(),
        identiconsSaga(),
        permissionsSaga(),
        messageSaga(),
        preferencesSaga(),
        roomSaga(),
        roomsSaga(),
        miscSaga(),
        lifecycle(),
    ])
})

export default store
