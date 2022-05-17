import { configureStore } from '@reduxjs/toolkit'
import session from './features/session'

const store = configureStore({
    reducer: {
        session,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['session/setEthereumProvider'],
                ignoredPaths: ['session.ethereumProvider'],
            },
        }),
})

export default store
