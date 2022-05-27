import { configureStore } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import wallet from './features/wallet'
import delegation from './features/delegation'
import rooms from './features/rooms'
import createSagaMiddleware from 'redux-saga'
import walletSaga from './features/wallet/saga'
import delegationSaga from './features/delegation/sagas'
import roomsSaga from './features/rooms/sagas'
import { WalletAction } from './features/wallet/actions'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {
        delegation,
        wallet,
        rooms,
    },
    middleware(getDefaultMiddleware) {
        return [
            ...getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [WalletAction.SetWalletProvider],
                    ignoredPaths: ['wallet.provider'],
                },
            }),
            sagaMiddleware,
        ]
    },
})

sagaMiddleware.run(function* saga() {
    yield all([walletSaga(), delegationSaga(), roomsSaga()])
})

export default store
