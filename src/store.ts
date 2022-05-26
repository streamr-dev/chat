import { configureStore } from '@reduxjs/toolkit'
import wallet from './features/wallet'
import createSagaMiddleware from 'redux-saga'
import walletSaga from './features/wallet/sagas'
import { WalletAction } from './features/wallet/actions'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {
        wallet,
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

sagaMiddleware.run(walletSaga)

export default store
