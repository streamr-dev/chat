import { configureStore } from '@reduxjs/toolkit'
import wallet from '$/features/wallet'
import delegation from '$/features/delegation'
import room from '$/features/room'
import permissions from '$/features/permissions'
import identicons from '$/features/identicons'
import createSagaMiddleware from 'redux-saga'
import message from '$/features/message'
import misc from '$/features/misc'
import flag from '$/features/flag'
import lifecycle from '$/features/lifecycle.saga'
import anon from '$/features/anon'
import toaster from '$/features/toaster'
import avatar from '$/features/avatar'

const defaultReducer = {
    delegation,
    flag,
    identicons,
    permissions,
    message,
    room,
    wallet,
    misc,
    anon,
    toaster,
    avatar,
}

export default function createStore(reducer = defaultReducer) {
    const sagaMiddleware = createSagaMiddleware()

    const store = configureStore({
        reducer,
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
                            'wallet.transactionalClient',
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

    sagaMiddleware.run(lifecycle)

    return store
}
