import { configureStore } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import wallet from './features/wallet'
import delegation from './features/delegation'
import rooms from './features/rooms'
import messages from './features/messages'
import members from './features/members'
import permissions from './features/permissions'
import createSagaMiddleware from 'redux-saga'
import walletSaga from './features/wallet/saga'
import delegationSaga from './features/delegation/sagas'
import roomsSaga from './features/rooms/sagas'
import messagesSaga from './features/messages/sagas'
import membersSaga from './features/members/sagas'
import permissionsSaga from './features/permissions/sagas'
import { WalletAction } from './features/wallet/actions'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {
        delegation,
        wallet,
        rooms,
        messages,
        members,
        permissions,
    },
    middleware(getDefaultMiddleware) {
        return [
            ...getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [WalletAction.SetWalletProvider],
                    ignoredPaths: ['wallet.provider', 'wallet.client'],
                },
            }),
            sagaMiddleware,
        ]
    },
})

sagaMiddleware.run(function* saga() {
    yield all([
        walletSaga(),
        delegationSaga(),
        roomsSaga(),
        messagesSaga(),
        membersSaga(),
        permissionsSaga(),
    ])
})

export default store
